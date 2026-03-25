import { NextRequest, NextResponse } from "next/server";

const endpoint = "/users/me";

export async function GET(request: NextRequest) {
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

  // Prefer the Authorization header forwarded by httpClient (in-memory token).
  // Fall back to the httpOnly accessToken cookie (e.g. after a page reload
  // when Redux memory is cleared but the cookie is still valid).
  const incomingAuthorization = request.headers.get("authorization");
  const cookieToken = request.cookies.get("accessToken")?.value;
  const authorizationHeader = incomingAuthorization
    ? incomingAuthorization
    : cookieToken
    ? `Bearer ${cookieToken}`
    : undefined;

  try {
    const backendResponse = await fetch(`${apiUrl}${endpoint}`, {
      method: "GET",
      headers: {
        ...(authorizationHeader ? { Authorization: authorizationHeader } : {}),
      },
      cache: "no-store",
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data?.message || "Failed to fetch user profile",
          error: data?.error || {
            code: `E${backendResponse.status}_USERS_ME_FAILED`,
            message: data?.message || "Failed to fetch user profile",
          },
        },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    console.error("Users/me fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to connect to backend service",
        error: {
          code: "E503_USERS_ME_SERVICE_UNAVAILABLE",
          message: "Backend service is unavailable. Please try again later.",
        },
      },
      { status: 503 }
    );
  }
}
