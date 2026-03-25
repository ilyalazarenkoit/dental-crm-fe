import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/auth/logout
 * Calls the backend to invalidate the refresh token, then clears local cookies.
 * Even if the backend call fails we still complete the local logout so the
 * user is never stuck in a half-logged-in state.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Notify the backend so it can blacklist / invalidate the refresh token.
    //    httpClient forwards the Authorization: Bearer header automatically,
    //    so we proxy whatever header arrived with this request.
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const authHeader = request.headers.get("Authorization");

    if (apiUrl) {
      try {
        await fetch(`${apiUrl}/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(authHeader ? { Authorization: authHeader } : {}),
          },
        });
      } catch (backendError) {
        // Log but do not abort — local logout must always succeed.
        console.error(
          "Backend logout error (continuing with local logout):",
          backendError
        );
      }
    }

    // 2. Clear local cookies and return success.
    const response = NextResponse.json(
      { message: "Logout successful" },
      { status: 200 }
    );

    // Clear access token cookie — httpOnly must match how it was set
    response.cookies.set("accessToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
      path: "/",
    });

    // Clear authentication flag
    response.cookies.set("is_authenticated", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
      path: "/",
    });

    // Clear refresh token — must use same flags as when it was set in login/route.ts
    response.cookies.set("refreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
      path: "/",
    });

    // Clear legacy cookies for backward compatibility
    const legacyCookies = [
      "auth_token",
      "refresh_token",
      "accessToken",
      "session",
      "session_type",
    ];

    legacyCookies.forEach((cookieName) => {
      response.cookies.set(cookieName, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: new Date(0),
        path: "/",
      });
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);

    return NextResponse.json(
      {
        message: "Internal server error during logout",
        error: {
          code: "E500_LOGOUT_FAILED",
          message: "Failed to process logout request",
        },
      },
      { status: 500 }
    );
  }
}
