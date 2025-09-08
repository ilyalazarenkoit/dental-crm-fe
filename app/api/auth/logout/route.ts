import { NextResponse } from "next/server";

/**
 * POST
 * /logout
 * Logout endpoint that clears authentication cookies and invalidates tokens
 */
export async function POST() {
  try {
    // Create response with success message
    const response = NextResponse.json(
      {
        message: "Logout successful",
      },
      { status: 200 }
    );

    // Clear access token cookie
    response.cookies.set("accessToken", "", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0), // Expire immediately
      path: "/",
    });

    // Clear authentication flag
    response.cookies.set("is_authenticated", "", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0), // Expire immediately
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
