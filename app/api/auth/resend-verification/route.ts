import { NextRequest, NextResponse } from "next/server";

/**
 * API route for resending verification email
 */
export async function POST(request: NextRequest) {
  try {
    // Get email from request body
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "E400_MISSING_EMAIL",
            message: "Email is required",
          },
        },
        { status: 400 }
      );
    }

    // Get base API URL from environment variables
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    try {
      // Send request to backend for resending verification email
      const response = await fetch(`${apiUrl}/auth/resend-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
        cache: "no-store",
      });

      const responseData = await response.json().catch(() => ({}));

      // For security, do not inform the user if the email exists in the system
      if (response.status === 404) {
        return NextResponse.json(
          {
            success: true,
          },
          { status: 200 }
        );
      }

      // Return successful response
      if (response.ok) {
        return NextResponse.json({
          success: true,
        });
      } else {
        // Handle errors from the backend
        let errorCode = "E500_SERVER_ERROR";

        if (response.status === 429) {
          errorCode = "E429_RATE_LIMIT";
        }

        console.error("Error from backend when sending email:", responseData);

        return NextResponse.json(
          {
            success: false,
            error: {
              code: responseData.error?.code || errorCode,
              message:
                responseData.message || "Failed to resend verification email",
            },
          },
          { status: response.status }
        );
      }
    } catch (apiError) {
      console.error("Error when sending email:", apiError);

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
    console.error("Error when processing request:", error);

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
