import { store } from "@store/store";
import {
  setRefreshing,
  logout,
  refreshAccessToken,
} from "@store/features/authSlice";
import { RefreshResponse } from "@models/auth.model";

/**
 * HTTP client with automatic token refresh
 * Updated for secure architecture: access token in Authorization header, refresh token in HttpOnly cookies
 */
class HttpClient {
  private isRefreshing = false;
  private refreshPromise: Promise<string> | null = null;
  private accessToken: string | null = null; // Store access token in memory

  /**
   * Set access token in memory
   */
  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * Make HTTP request with automatic token refresh
   */
  async request(url: string, options: RequestInit = {}): Promise<Response> {
    // Get access token from Redux state (if not in memory)
    if (!this.accessToken) {
      const state = store.getState();
      this.accessToken = state.auth?.accessToken ?? null;
    }

    // Add Authorization header if we have access token
    const headers: HeadersInit = {
      ...options.headers,
      ...(this.accessToken && { Authorization: `Bearer ${this.accessToken}` }),
    };

    const requestOptions: RequestInit = {
      ...options,
      headers,
      credentials: "include", // Always include cookies for refresh token
    };

    let response = await fetch(url, requestOptions);

    // If 401, try to refresh token
    if (response.status === 401) {
      try {
        const newAccessToken = await this.refreshTokens();

        // Retry original request with new token
        const retryHeaders: HeadersInit = {
          ...options.headers,
          Authorization: `Bearer ${newAccessToken}`,
        };

        const retryOptions: RequestInit = {
          ...options,
          headers: retryHeaders,
          credentials: "include",
        };

        response = await fetch(url, retryOptions);
      } catch {
        // Refresh failed - logout user
        this.accessToken = null;
        store.dispatch(logout());
        throw new Error("Session expired. Please login again.");
      }
    }

    return response;
  }

  /**
   * Refresh access token using refresh token from HttpOnly cookie
   */
  private async refreshTokens(): Promise<string> {
    // Prevent multiple refresh requests
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    store.dispatch(setRefreshing(true));

    this.refreshPromise = this.performRefresh();

    try {
      const newAccessToken = await this.refreshPromise;
      return newAccessToken;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
      store.dispatch(setRefreshing(false));
    }
  }

  /**
   * Perform the actual refresh request
   */
  private async performRefresh(): Promise<string> {
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include", // Send refresh token cookie
    });

    if (!response.ok) {
      throw new Error("Token refresh failed");
    }

    const data: RefreshResponse = await response.json();

    // Update access token in memory
    this.accessToken = data.accessToken;

    // Update Redux state with new user data
    store.dispatch(
      refreshAccessToken({
        accessToken: data.accessToken,
        user: data.user,
      })
    );

    return data.accessToken;
  }

  /**
   * Clear access token from memory
   */
  clearAccessToken() {
    this.accessToken = null;
  }
}

// Export singleton instance
export const httpClient = new HttpClient();
