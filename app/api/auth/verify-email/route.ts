import { NextRequest, NextResponse } from "next/server";

/**
 * API route for email verification
 * Accepts GET request with token as query parameter
 * Example: /api/auth/verify-email?token=abc123
 */
export async function GET(request: NextRequest) {
  try {
    // Get token from URL query parameters
    const url = new URL(request.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "E400_INVALID_TOKEN",
            message: "Invalid or missing token",
          },
        },
        { status: 400 }
      );
    }

    // Get base API URL from environment variables
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    try {
      // Send request to backend for verification
      const response = await fetch(
        `${apiUrl}/auth/verify-email?token=${token}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      // Parse the response data
      const data = await response.json().catch(() => ({}));

      // Check if the response is successful
      if (response.ok) {
        return NextResponse.json({
          success: true,
          data,
        });
      } else {
        // Extract error information
        const errorCode = data.error?.code || "E500_SERVER_ERROR";
        const errorMessage = data.message || "Failed to verify email";

        console.error("Error from backend when verifying email:", errorMessage);

        return NextResponse.json(
          {
            success: false,
            error: {
              code: errorCode,
              message: errorMessage,
            },
          },
          { status: response.status }
        );
      }
    } catch (apiError) {
      console.error("Error when verifying email:", apiError);

      return NextResponse.json(
        {
          success: false,
          error: {
            code: "E500_SERVER_ERROR",
            message:
              apiError instanceof Error ? apiError.message : String(apiError),
          },
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error when processing verification request:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "E500_SERVER_ERROR",
          message: error instanceof Error ? error.message : String(error),
        },
      },
      { status: 500 }
    );
  }
}

/**
 * POST method is kept for backward compatibility
 * It extracts the token from the request body and redirects to the GET handler
 */
export async function POST(request: NextRequest) {
  try {
    // Get token from request body
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "E400_INVALID_TOKEN",
            message: "Invalid or missing token",
          },
        },
        { status: 400 }
      );
    }

    // Create a new request with the token in the URL
    const url = new URL(request.url);
    url.searchParams.set("token", token);

    // Create a new request with the token in the query parameters
    const newRequest = new NextRequest(url, {
      headers: request.headers,
    });

    // Forward to the GET handler
    return GET(newRequest);
  } catch (error) {
    console.error("Error when processing POST verification request:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "E500_SERVER_ERROR",
          message: error instanceof Error ? error.message : String(error),
        },
      },
      { status: 500 }
    );
  }
}
