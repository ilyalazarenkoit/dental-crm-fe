/**
 * Reads refreshToken from backend Set-Cookie (Node fetch exposes getSetCookie()).
 * Mirrors login/route.ts — backend may rotate the refresh token via headers only.
 */
export function extractRefreshTokenFromBackendSetCookie(
  backendResponse: Response
): string | undefined {
  const headersWithGetSetCookie = backendResponse.headers as unknown as {
    getSetCookie?: () => string[];
  };
  const setCookieHeaders: string[] =
    typeof headersWithGetSetCookie.getSetCookie === "function"
      ? headersWithGetSetCookie.getSetCookie()
      : [backendResponse.headers.get("set-cookie") ?? ""].filter(Boolean);

  const refreshCookieStr = setCookieHeaders.find((c) =>
    c.toLowerCase().startsWith("refreshtoken=")
  );

  if (!refreshCookieStr) {
    return undefined;
  }

  const rawValue = refreshCookieStr.split(";")[0];
  const tokenValue = rawValue.split("=").slice(1).join("=");
  return tokenValue || undefined;
}
