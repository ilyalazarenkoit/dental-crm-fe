import { NextRequest, NextResponse } from "next/server";
import { extractRefreshTokenFromBackendSetCookie } from "@/lib/api/extract-refresh-token-from-set-cookie";

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token from HTTP-only cookie
 */
export async function POST(request: NextRequest) {
  try {
    // Get refresh token from HTTP-only cookie

    const refreshToken = request.cookies.get("refreshToken")?.value;
    if (!refreshToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Refresh token not found",
          error: {
            code: "E401_REFRESH_TOKEN_MISSING",
            message: "Refresh token not found",
          },
        },
        { status: 401 }
      );
    }

    // Get backend API URL from environment
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      console.error("NEXT_PUBLIC_API_URL is not defined");
      return NextResponse.json(
        {
          success: false,
          message: "Server configuration error",
          error: {
            code: "E500_CONFIGURATION_ERROR",
            message: "Server configuration error",
          },
        },
        { status: 500 }
      );
    }

    const refreshUrl = `${apiUrl}/auth/refresh`;

    // Make API call to backend with refresh token
    try {
      const backendResponse = await fetch(refreshUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `refreshToken=${encodeURIComponent(refreshToken)}`,
        },
      });

      if (!backendResponse.ok) {
        const errorData = await backendResponse.json();

        // Handle specific error cases
        if (backendResponse.status === 401) {
          if (errorData.message?.includes("expired")) {
            return NextResponse.json(
              {
                success: false,
                message: "Refresh token has expired",
                error: {
                  code: "E401_REFRESH_TOKEN_EXPIRED",
                  message: "Refresh token has expired",
                },
              },
              { status: 401 }
            );
          } else if (errorData.message?.includes("invalid")) {
            return NextResponse.json(
              {
                success: false,
                message: "Invalid refresh token",
                error: {
                  code: "E401_INVALID_REFRESH_TOKEN",
                  message: "Invalid refresh token",
                },
              },
              { status: 401 }
            );
          } else {
            return NextResponse.json(
              {
                success: false,
                message: "Token refresh failed",
                error: {
                  code: "E401_REFRESH_FAILED",
                  message: "Token refresh failed",
                },
              },
              { status: 401 }
            );
          }
        }

        return NextResponse.json(
          {
            success: false,
            message: errorData.message || "Token refresh failed",
            error: {
              code: `E${backendResponse.status}_REFRESH_FAILED`,
              message: errorData.message || "Token refresh failed",
            },
          },
          { status: backendResponse.status }
        );
      }

      const data = await backendResponse.json();

      // Extract data from the correct structure
      const accessToken = data.data?.accessToken || data.accessToken;
      const newRefreshTokenFromBody =
        data.data?.refreshToken || data.refreshToken;
      // Backend may rotate refresh token via Set-Cookie only (same as login).
      // If we only read JSON, the browser keeps the old cookie → next refresh → 401.
      const newRefreshTokenFromCookie =
        extractRefreshTokenFromBackendSetCookie(backendResponse);
      const newRefreshToken =
        newRefreshTokenFromBody || newRefreshTokenFromCookie;
      const user = data.data?.user || data.user;

      if (!accessToken || !user) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid response from backend",
            error: {
              code: "E500_INVALID_RESPONSE",
              message: "Invalid response from backend",
            },
          },
          { status: 500 }
        );
      }

      // Create response with new access token (secure architecture)
      const response = NextResponse.json(
        {
          success: true,
          message: "Token refreshed successfully",
          accessToken: accessToken,
          user: user,
        },
        { status: 200 }
      );

      // Refresh the accessToken cookie so middleware always sees a valid token.
      // Without this, after 15 min a hard-reload (F5) would find no accessToken
      // cookie, middleware would redirect to login even though the refresh token
      // is still valid.
      response.cookies.set("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60,
        path: "/",
      });

      // Update refresh token cookie when backend rotated it (JSON and/or Set-Cookie).
      if (newRefreshToken) {
        response.cookies.set("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60,
          path: "/",
        });
      }

      return response;
    } catch (fetchError) {
      console.error("Fetch error:", fetchError);

      // Handle connection errors
      if (
        fetchError instanceof Error &&
        fetchError.message.includes("fetch failed")
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Backend service is unavailable",
            error: {
              code: "E503_SERVICE_UNAVAILABLE",
              message:
                "Backend service is unavailable. Please try again later.",
            },
          },
          { status: 503 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: "Internal server error",
          error: {
            code: "E500_INTERNAL_ERROR",
            message: "An unexpected error occurred",
          },
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Refresh token error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: {
          code: "E500_INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred",
        },
      },
      { status: 500 }
    );
  }
}
