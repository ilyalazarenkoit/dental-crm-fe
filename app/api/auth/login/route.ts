import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Login validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation error",
          error: {
            code: "E400_VALIDATION_ERROR",
            message:
              validationResult.error.errors[0]?.message || "Invalid input",
          },
        },
        { status: 400 }
      );
    }

    const { email, password } = validationResult.data;

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

    const loginUrl = `${apiUrl}/auth/login`;

    // Make API call to backend
    try {
      const backendResponse = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!backendResponse.ok) {
        const errorData = await backendResponse.json();

        // Handle specific error cases
        if (backendResponse.status === 401) {
          if (errorData.message?.includes("verify")) {
            return NextResponse.json(
              {
                success: false,
                message: "Please verify your email first",
                error: {
                  code: "E401_EMAIL_NOT_VERIFIED",
                  message: "Please verify your email first",
                },
              },
              { status: 401 }
            );
          } else if (errorData.message?.includes("active")) {
            return NextResponse.json(
              {
                success: false,
                message: "Your account is not active",
                error: {
                  code: "E401_ACCOUNT_NOT_ACTIVE",
                  message: "Your account is not active",
                },
              },
              { status: 401 }
            );
          } else {
            return NextResponse.json(
              {
                success: false,
                message: "Invalid email or password",
                error: {
                  code: "E401_INVALID_CREDENTIALS",
                  message: "Invalid email or password",
                },
              },
              { status: 401 }
            );
          }
        }

        return NextResponse.json(
          {
            success: false,
            message: errorData.message || "Login failed",
            error: {
              code: `E${backendResponse.status}_LOGIN_FAILED`,
              message: errorData.message || "Login failed",
            },
          },
          { status: backendResponse.status }
        );
      }

      const data = await backendResponse.json();

      // Extract data from the correct structure
      const accessToken = data.data?.accessToken || data.accessToken;
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

      // Create response with access token in JSON (secure architecture)
      const response = NextResponse.json(
        {
          success: true,
          message: "Login successful",
          accessToken: accessToken,
          user: user,
        },
        { status: 200 }
      );

      // Debug: Log backend response headers

      // Check if backend set refresh token cookie

      // Set access token in cookie for middleware (not HttpOnly)
      response.cookies.set("accessToken", accessToken, {
        httpOnly: false, // Accessible in middleware
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60, // 15 minutes (same as token expiry)
        path: "/",
      });

      // Set authentication flag
      response.cookies.set("is_authenticated", "true", {
        httpOnly: false, // Accessible in middleware
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: "/",
      });

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
    console.error("Login error:", error);
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
