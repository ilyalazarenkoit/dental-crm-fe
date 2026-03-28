import { NextRequest, NextResponse } from "next/server";

const endpoint = "/patients";

export async function POST(request: NextRequest) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    return NextResponse.json(
      { success: false, message: "Server configuration error" },
      { status: 500 }
    );
  }

  const incomingAuthorization = request.headers.get("authorization");
  const cookieToken = request.cookies.get("accessToken")?.value;
  const authorizationHeader = incomingAuthorization
     ? incomingAuthorization
     : cookieToken
       ? `Bearer ${cookieToken}`
       : undefined;



  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body" },
      { status: 400 }
    );
  }

  try {
    const backendResponse = await fetch(`${apiUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authorizationHeader ? { Authorization: authorizationHeader } : {}),
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const contentType = backendResponse.headers.get("content-type");
    const data = contentType?.includes("application/json")
      ? await backendResponse.json()
      : { message: `Backend error ${backendResponse.status}` };

    if (!backendResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data?.message ?? "Failed to create patient",
        },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Create patient error:", error);
    return NextResponse.json(
      { success: false, message: "Backend service unavailable" },
      { status: 503 }
    );
  }
}

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

  const proxyUrl = new URL(`${apiUrl}${endpoint}`);
  const { searchParams } = new URL(request.url);

  searchParams.forEach((value, key) => {
    proxyUrl.searchParams.append(key, value);
  });

  const incomingAuthorization = request.headers.get("authorization");
  const cookieToken = request.cookies.get("accessToken")?.value;
  const authorizationHeader = incomingAuthorization
    ? incomingAuthorization
    : cookieToken
    ? `Bearer ${cookieToken}`
    : undefined;

  try {
    const backendResponse = await fetch(proxyUrl, {
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
          message: data?.message || "Failed to fetch patients",
          error: data?.error || {
            code: `E${backendResponse.status}_PATIENTS_FETCH_FAILED`,
            message: data?.message || "Failed to fetch patients",
          },
        },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    console.error("Patients fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to connect to backend service",
        error: {
          code: "E503_PATIENTS_SERVICE_UNAVAILABLE",
          message: "Backend service is unavailable. Please try again later.",
        },
      },
      { status: 503 }
    );
  }
}
