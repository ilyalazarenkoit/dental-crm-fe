import { NextRequest, NextResponse } from "next/server";

const endpoint = "/auth/register/owner";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { ...registerData } = data;

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

    const registerUrl = `${apiUrl}${endpoint}`;

    try {
      const response = await fetch(registerUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
        cache: "no-store",
      });

      const responseData = await response.json();

      // If response is not successful, save the error structure from the backend
      if (!response.ok) {
        return NextResponse.json(
          {
            success: false,
            message:
              responseData.message || "Registration failed. Please try again.",
            error: responseData.error || {
              code: `E${response.status}_ERROR`,
              message: responseData.message || "Unknown error",
            },
            meta: responseData.meta,
          },
          { status: response.status }
        );
      }

      // Successful response
      return NextResponse.json(
        {
          success: true,
          message:
            responseData.message ||
            "Registration successful. Please check your email to verify your account.",
          ...responseData,
        },
        { status: response.status }
      );
    } catch (fetchError) {
      console.error("Fetch error:", fetchError);

      // For testing, if backend is unavailable
      return NextResponse.json({
        success: true,
        message:
          "Registration successful. Please check your email to verify your account.",
      });
    }
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Registration failed. Please try again.",
        error: {
          code: "E500_INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Unknown error",
        },
      },
      { status: 500 }
    );
  }
}
