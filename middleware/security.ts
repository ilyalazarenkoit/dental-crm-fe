import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Comprehensive Security Middleware
 * Based on OWASP Top 10, NIST Cybersecurity Framework
 * Author: Senior Cybersecurity Engineer
 */

export function securityMiddleware(request: NextRequest) {
  const response = NextResponse.next();

  // Get request information
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get("user-agent") || "";
  const referer = request.headers.get("referer") || "";
  const origin = request.headers.get("origin") || "";
  const ipAddress =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";

  // 1. SQL Injection protection in URL parameters
  const sqlInjectionPatterns = [
    /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute|script)\b)/i,
    /(\b(and|or)\s+\d+\s*=\s*\d+)/i,
    /(\b(and|or)\s+['"]?\w+['"]?\s*=\s*['"]?\w+['"]?)/i,
    /(\b(union|select)\s+.*\bfrom\b)/i,
    /(\b(union|select)\s+.*\bwhere\b)/i,
    /(\b(union|select)\s+.*\border\s+by\b)/i,
    /(\b(union|select)\s+.*\bgroup\s+by\b)/i,
    /(\b(union|select)\s+.*\bhaving\b)/i,
    /(\b(union|select)\s+.*\blimit\b)/i,
    /(\b(union|select)\s+.*\boffset\b)/i,
    /(\b(union|select)\s+.*\btop\b)/i,
    /(\b(union|select)\s+.*\bdistinct\b)/i,
    /(\b(union|select)\s+.*\bcount\b)/i,
    /(\b(union|select)\s+.*\bsum\b)/i,
    /(\b(union|select)\s+.*\bavg\b)/i,
    /(\b(union|select)\s+.*\bmax\b)/i,
    /(\b(union|select)\s+.*\bmin\b)/i,
    /(\b(union|select)\s+.*\bcase\b)/i,
    /(\b(union|select)\s+.*\bwhen\b)/i,
    /(\b(union|select)\s+.*\bthen\b)/i,
    /(\b(union|select)\s+.*\belse\b)/i,
    /(\b(union|select)\s+.*\bend\b)/i,
    /(\b(union|select)\s+.*\bas\b)/i,
    /(\b(union|select)\s+.*\bin\b)/i,
    /(\b(union|select)\s+.*\bbetween\b)/i,
    /(\b(union|select)\s+.*\blike\b)/i,
    /(\b(union|select)\s+.*\bin\s*\()/i,
    /(\b(union|select)\s+.*\bexists\s*\()/i,
    /(\b(union|select)\s+.*\bnot\s+exists\s*\()/i,
    /(\b(union|select)\s+.*\bany\s*\()/i,
    /(\b(union|select)\s+.*\ball\s*\()/i,
    /(\b(union|select)\s+.*\bsome\s*\()/i,
    /(\b(union|select)\s+.*\bwith\b)/i,
    /(\b(union|select)\s+.*\bcte\b)/i,
    /(\b(union|select)\s+.*\brecursive\b)/i,
    /(\b(union|select)\s+.*\bwindow\b)/i,
    /(\b(union|select)\s+.*\bover\b)/i,
    /(\b(union|select)\s+.*\bpartition\s+by\b)/i,
    /(\b(union|select)\s+.*\border\s+by\b)/i,
    /(\b(union|select)\s+.*\brows\s+between\b)/i,
    /(\b(union|select)\s+.*\bunbounded\b)/i,
    /(\b(union|select)\s+.*\bpreceding\b)/i,
    /(\b(union|select)\s+.*\bfollowing\b)/i,
    /(\b(union|select)\s+.*\bcurrent\s+row\b)/i,
    /(\b(union|select)\s+.*\brow\b)/i,
    /(\b(union|select)\s+.*\brange\b)/i,
    /(\b(union|select)\s+.*\bgroups\b)/i,
    /(\b(union|select)\s+.*\brows\b)/i,
  ];

  const urlString = request.url;
  const hasSqlInjection = sqlInjectionPatterns.some((pattern) =>
    pattern.test(urlString)
  );

  if (hasSqlInjection) {
    console.warn("[SECURITY] Potential SQL injection attempt detected", {
      ipAddress,
      userAgent,
      url: urlString,
      timestamp: new Date().toISOString(),
    });

    return new NextResponse("Forbidden", { status: 403 });
  }

  // 2. XSS protection in URL parameters
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /onload\s*=/gi,
    /onerror\s*=/gi,
    /onclick\s*=/gi,
    /onmouseover\s*=/gi,
    /onfocus\s*=/gi,
    /onblur\s*=/gi,
    /onchange\s*=/gi,
    /onsubmit\s*=/gi,
    /onreset\s*=/gi,
    /onselect\s*=/gi,
    /onunload\s*=/gi,
    /onabort\s*=/gi,
    /onbeforeunload\s*=/gi,
    /onhashchange\s*=/gi,
    /onmessage\s*=/gi,
    /onoffline\s*=/gi,
    /ononline\s*=/gi,
    /onpagehide\s*=/gi,
    /onpageshow\s*=/gi,
    /onpopstate\s*=/gi,
    /onresize\s*=/gi,
    /onstorage\s*=/gi,
    /oncontextmenu\s*=/gi,
    /oncopy\s*=/gi,
    /oncut\s*=/gi,
    /onpaste\s*=/gi,
    /onkeydown\s*=/gi,
    /onkeypress\s*=/gi,
    /onkeyup\s*=/gi,
    /onmousedown\s*=/gi,
    /onmousemove\s*=/gi,
    /onmouseout\s*=/gi,
    /onmouseup\s*=/gi,
    /onwheel\s*=/gi,
    /oninput\s*=/gi,
    /oninvalid\s*=/gi,
    /onsearch\s*=/gi,
    /onbeforeprint\s*=/gi,
    /onafterprint\s*=/gi,
    /onbeforecopy\s*=/gi,
    /onbeforecut\s*=/gi,
    /onbeforepaste\s*=/gi,
  ];

  const hasXss = xssPatterns.some((pattern) => pattern.test(urlString));

  if (hasXss) {
    console.warn("[SECURITY] Potential XSS attempt detected", {
      ipAddress,
      userAgent,
      url: urlString,
      timestamp: new Date().toISOString(),
    });

    return new NextResponse("Forbidden", { status: 403 });
  }

  // 3. Path Traversal protection
  const pathTraversalPatterns = [
    /\.\.\//g,
    /\.\.\\/g,
    /\.\.%2f/g,
    /\.\.%5c/g,
    /\.\.%2F/g,
    /\.\.%5C/g,
    /\.\.%c0%af/g,
    /\.\.%c1%9c/g,
    /\.\.%c0%AF/g,
    /\.\.%c1%9C/g,
    /\.\.%252f/g,
    /\.\.%255c/g,
    /\.\.%252F/g,
    /\.\.%255C/g,
    /\.\.%c0%2f/g,
    /\.\.%c1%5c/g,
    /\.\.%c0%2F/g,
    /\.\.%c1%5C/g,
  ];

  const hasPathTraversal = pathTraversalPatterns.some((pattern) =>
    pattern.test(pathname)
  );

  if (hasPathTraversal) {
    console.warn("[SECURITY] Potential path traversal attempt detected", {
      ipAddress,
      userAgent,
      pathname,
      timestamp: new Date().toISOString(),
    });

    return new NextResponse("Forbidden", { status: 403 });
  }

  // 4. Suspicious User-Agent protection
  const suspiciousUserAgents = [
    /sqlmap/i,
    /nikto/i,
    /nmap/i,
    /w3af/i,
    /burp/i,
    /zap/i,
    /acunetix/i,
    /nessus/i,
    /openvas/i,
    /metasploit/i,
    /hydra/i,
    /john/i,
    /hashcat/i,
    /aircrack/i,
    /kismet/i,
    /wireshark/i,
    /tcpdump/i,
    /netcat/i,
    /nc\s/i,
    /curl\s.*-A\s*[^-]*sqlmap/i,
    /python.*requests/i,
    /perl.*lwp/i,
    /ruby.*net::http/i,
    /php.*curl/i,
    /java.*httpclient/i,
    /go.*http/i,
    /rust.*reqwest/i,
    /node.*axios/i,
    /node.*fetch/i,
    /node.*request/i,
    /node.*superagent/i,
    /node.*got/i,
    /node.*needle/i,
    /node.*phin/i,
    /node.*unirest/i,
    /node.*httpreq/i,
    /node.*http/i,
    /node.*https/i,
    /node.*url/i,
    /node.*querystring/i,
    /node.*crypto/i,
    /node.*fs/i,
    /node.*path/i,
    /node.*os/i,
    /node.*child_process/i,
    /node.*exec/i,
    /node.*spawn/i,
    /node.*fork/i,
    /node.*cluster/i,
    /node.*worker/i,
    /node.*worker_threads/i,
    /node.*vm/i,
    /node.*eval/i,
    /node.*Function/i,
    /node.*setTimeout/i,
    /node.*setInterval/i,
    /node.*setImmediate/i,
    /node.*process/i,
    /node.*Buffer/i,
    /node.*Stream/i,
    /node.*EventEmitter/i,
    /node.*events/i,
    /node.*util/i,
    /node.*querystring/i,
    /node.*url/i,
    /node.*http/i,
    /node.*https/i,
    /node.*fs/i,
    /node.*path/i,
    /node.*os/i,
    /node.*crypto/i,
    /node.*zlib/i,
    /node.*tls/i,
    /node.*net/i,
    /node.*dgram/i,
    /node.*dns/i,
    /node.*readline/i,
    /node.*repl/i,
    /node.*v8/i,
    /node.*vm/i,
    /node.*inspector/i,
    /node.*perf_hooks/i,
    /node.*async_hooks/i,
    /node.*trace_events/i,
    /node.*stream/i,
    /node.*buffer/i,
  ];

  const hasSuspiciousUserAgent = suspiciousUserAgents.some((pattern) =>
    pattern.test(userAgent)
  );

  if (hasSuspiciousUserAgent) {
    console.warn("[SECURITY] Suspicious User-Agent detected", {
      ipAddress,
      userAgent,
      pathname,
      timestamp: new Date().toISOString(),
    });

    // Don't block, but log for monitoring
  }

  // 5. Suspicious Referer protection
  if (
    referer &&
    !referer.startsWith(
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    )
  ) {
    console.warn("[SECURITY] Suspicious Referer detected", {
      ipAddress,
      userAgent,
      referer,
      pathname,
      timestamp: new Date().toISOString(),
    });
  }

  // 6. Suspicious Origin protection
  if (
    origin &&
    !origin.startsWith(
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    )
  ) {
    console.warn("[SECURITY] Suspicious Origin detected", {
      ipAddress,
      userAgent,
      origin,
      pathname,
      timestamp: new Date().toISOString(),
    });
  }

  // 7. Suspicious IP addresses protection
  const suspiciousIPs = [
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
    /^192\.168\./,
    /^127\./,
    /^0\.0\.0\.0$/,
    /^255\.255\.255\.255$/,
  ];

  const hasSuspiciousIP = suspiciousIPs.some((pattern) =>
    pattern.test(ipAddress)
  );

  if (hasSuspiciousIP) {
    console.warn("[SECURITY] Suspicious IP address detected", {
      ipAddress,
      userAgent,
      pathname,
      timestamp: new Date().toISOString(),
    });
  }

  // 8. Suspicious headers protection
  const suspiciousHeaders = [
    "x-forwarded-host",
    "x-forwarded-server",
    "x-forwarded-uri",
    "x-forwarded-for",
    "x-real-ip",
    "x-client-ip",
    "x-cluster-client-ip",
    "x-forwarded",
    "x-forwarded-by",
    "x-original-url",
    "x-rewrite-url",
    "x-script-name",
    "x-script-filename",
    "x-script-translated",
    "x-script-translated-name",
    "x-script-translated-filename",
    "x-script-translated-uri",
    "x-script-translated-path",
    "x-script-translated-query",
    "x-script-translated-fragment",
    "x-script-translated-host",
    "x-script-translated-port",
    "x-script-translated-protocol",
    "x-script-translated-scheme",
    "x-script-translated-user",
    "x-script-translated-password",
    "x-script-translated-authority",
    "x-script-translated-pathname",
    "x-script-translated-search",
    "x-script-translated-hash",
  ];

  suspiciousHeaders.forEach((header) => {
    if (request.headers.get(header)) {
      console.warn(`[SECURITY] Suspicious header detected: ${header}`, {
        ipAddress,
        userAgent,
        pathname,
        header,
        value: request.headers.get(header),
        timestamp: new Date().toISOString(),
      });
    }
  });

  // 9. Suspicious methods protection
  const allowedMethods = [
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "PATCH",
    "HEAD",
    "OPTIONS",
  ];
  const method = request.method;

  if (!allowedMethods.includes(method)) {
    console.warn("[SECURITY] Unusual HTTP method detected", {
      ipAddress,
      userAgent,
      method,
      pathname,
      timestamp: new Date().toISOString(),
    });

    return new NextResponse("Method Not Allowed", { status: 405 });
  }

  // 10. Suspicious Content-Type protection
  const contentType = request.headers.get("content-type");

  if (contentType && method === "POST") {
    const suspiciousContentTypes = [
      /application\/x-www-form-urlencoded.*script/i,
      /text\/html.*script/i,
      /text\/xml.*script/i,
      /application\/xml.*script/i,
      /text\/javascript/i,
      /application\/javascript/i,
      /text\/ecmascript/i,
      /application\/ecmascript/i,
      /text\/jscript/i,
      /application\/jscript/i,
      /text\/vbscript/i,
      /application\/vbscript/i,
      /text\/vbs/i,
      /application\/vbs/i,
      /text\/vbe/i,
      /application\/vbe/i,
      /text\/wsf/i,
      /application\/wsf/i,
      /text\/wsc/i,
      /application\/wsc/i,
      /text\/hta/i,
      /application\/hta/i,
      /text\/htc/i,
      /application\/htc/i,
      /text\/asp/i,
      /application\/asp/i,
      /text\/aspx/i,
      /application\/aspx/i,
      /text\/php/i,
      /application\/php/i,
      /text\/jsp/i,
      /application\/jsp/i,
      /text\/cfm/i,
      /application\/cfm/i,
      /text\/cfml/i,
      /application\/cfml/i,
      /text\/pl/i,
      /application\/pl/i,
      /text\/py/i,
      /application\/py/i,
      /text\/rb/i,
      /application\/rb/i,
      /text\/sh/i,
      /application\/sh/i,
      /text\/bat/i,
      /application\/bat/i,
      /text\/cmd/i,
      /application\/cmd/i,
      /text\/com/i,
      /application\/com/i,
      /text\/exe/i,
      /application\/exe/i,
      /text\/pif/i,
      /application\/pif/i,
      /text\/scr/i,
      /application\/scr/i,
    ];

    const hasSuspiciousContentType = suspiciousContentTypes.some((pattern) =>
      pattern.test(contentType)
    );

    if (hasSuspiciousContentType) {
      console.warn("[SECURITY] Suspicious Content-Type detected", {
        ipAddress,
        userAgent,
        contentType,
        method,
        pathname,
        timestamp: new Date().toISOString(),
      });

      return new NextResponse("Unsupported Media Type", { status: 415 });
    }
  }

  // 11. Suspicious Accept headers protection
  const accept = request.headers.get("accept");

  if (accept) {
    const suspiciousAccept = [
      /text\/html.*script/i,
      /text\/xml.*script/i,
      /application\/xml.*script/i,
      /text\/javascript/i,
      /application\/javascript/i,
      /text\/ecmascript/i,
      /application\/ecmascript/i,
      /text\/jscript/i,
      /application\/jscript/i,
      /text\/vbscript/i,
      /application\/vbscript/i,
      /text\/vbs/i,
      /application\/vbs/i,
      /text\/vbe/i,
      /application\/vbe/i,
      /text\/wsf/i,
      /application\/wsf/i,
      /text\/wsc/i,
      /application\/wsc/i,
      /text\/hta/i,
      /application\/hta/i,
      /text\/htc/i,
      /application\/htc/i,
      /text\/asp/i,
      /application\/asp/i,
      /text\/aspx/i,
      /application\/aspx/i,
      /text\/php/i,
      /application\/php/i,
      /text\/jsp/i,
      /application\/jsp/i,
      /text\/cfm/i,
      /application\/cfm/i,
      /text\/cfml/i,
      /application\/cfml/i,
      /text\/pl/i,
      /application\/pl/i,
      /text\/py/i,
      /application\/py/i,
      /text\/rb/i,
      /application\/rb/i,
      /text\/sh/i,
      /application\/sh/i,
      /text\/bat/i,
      /application\/bat/i,
      /text\/cmd/i,
      /application\/cmd/i,
      /text\/com/i,
      /application\/com/i,
      /text\/exe/i,
      /application\/exe/i,
      /text\/pif/i,
      /application\/pif/i,
      /text\/scr/i,
      /application\/scr/i,
    ];

    const hasSuspiciousAccept = suspiciousAccept.some((pattern) =>
      pattern.test(accept)
    );

    if (hasSuspiciousAccept) {
      console.warn("[SECURITY] Suspicious Accept header detected", {
        ipAddress,
        userAgent,
        accept,
        pathname,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // 12. Suspicious Accept-Language headers protection
  const acceptLanguage = request.headers.get("accept-language");

  if (acceptLanguage) {
    const suspiciousAcceptLanguage = [
      /script/i,
      /javascript/i,
      /vbscript/i,
      /vbs/i,
      /vbe/i,
      /wsf/i,
      /wsc/i,
      /hta/i,
      /htc/i,
      /asp/i,
      /aspx/i,
      /php/i,
      /jsp/i,
      /cfm/i,
      /cfml/i,
      /pl/i,
      /py/i,
      /rb/i,
      /sh/i,
      /bat/i,
      /cmd/i,
      /com/i,
      /exe/i,
      /pif/i,
      /scr/i,
    ];

    const hasSuspiciousAcceptLanguage = suspiciousAcceptLanguage.some(
      (pattern) => pattern.test(acceptLanguage)
    );

    if (hasSuspiciousAcceptLanguage) {
      console.warn("[SECURITY] Suspicious Accept-Language header detected", {
        ipAddress,
        userAgent,
        acceptLanguage,
        pathname,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // 13. Suspicious Accept-Encoding headers protection
  const acceptEncoding = request.headers.get("accept-encoding");

  if (acceptEncoding) {
    const suspiciousAcceptEncoding = [
      /script/i,
      /javascript/i,
      /vbscript/i,
      /vbs/i,
      /vbe/i,
      /wsf/i,
      /wsc/i,
      /hta/i,
      /htc/i,
      /asp/i,
      /aspx/i,
      /php/i,
      /jsp/i,
      /cfm/i,
      /cfml/i,
      /pl/i,
      /py/i,
      /rb/i,
      /sh/i,
      /bat/i,
      /cmd/i,
      /com/i,
      /exe/i,
      /pif/i,
      /scr/i,
    ];

    const hasSuspiciousAcceptEncoding = suspiciousAcceptEncoding.some(
      (pattern) => pattern.test(acceptEncoding)
    );

    if (hasSuspiciousAcceptEncoding) {
      console.warn("[SECURITY] Suspicious Accept-Encoding header detected", {
        ipAddress,
        userAgent,
        acceptEncoding,
        pathname,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Add security headers to response
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()"
  );

  return response;
}
