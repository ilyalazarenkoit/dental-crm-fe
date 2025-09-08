/**
 * Rate Limiting System for Attack Protection
 * Based on OWASP Rate Limiting Cheat Sheet and NIST SP 800-53
 * Author: Senior Cybersecurity Engineer
 */

import { securityLogger } from "./security-logger";

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum number of requests
  skipSuccessfulRequests?: boolean; // Skip successful requests
  skipFailedRequests?: boolean; // Skip failed requests
  keyGenerator?: (req: unknown) => string; // Key generation function
  handler?: (req: unknown, res: unknown) => void; // Rate limit exceeded handler
  description: string; // Rule description for logging
}

export interface RateLimitRule {
  endpoint: string;
  config: RateLimitConfig;
  description: string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

export interface RequestInfo {
  count: number;
  resetTime: number;
}

export interface RateLimitStats {
  totalRequests: number;
  activeSessions: number;
}

export interface NextApiRequest {
  headers: Record<string, string | string[] | undefined>;
  connection?: {
    remoteAddress?: string;
  };
  socket?: {
    remoteAddress?: string;
  };
}

export interface NextApiResponse {
  status: (code: number) => NextApiResponse;
  json: (data: unknown) => NextApiResponse;
  setHeader: (name: string, value: string | number) => NextApiResponse;
}

export class RateLimiter {
  private static instance: RateLimiter;
  private requestCounts: Map<string, RequestInfo> = new Map();
  private rules: Map<string, RateLimitConfig> = new Map();
  private securityLogger: typeof securityLogger | null = null;
  private cleanupInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.setupDefaultRules();
    this.startCleanupInterval();
  }

  static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter();
    }
    return RateLimiter.instance;
  }

  /**
   * Setup default rate limiting rules
   */
  private setupDefaultRules(): void {
    // Authentication - strict limitations
    this.addRule("/api/auth/login", {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 5, // 5 login attempts
      description: "Login attempts rate limiting",
    });

    // Password recovery
    this.addRule("/api/auth/password-recovery", {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 3, // 3 recovery attempts
      description: "Password recovery rate limiting",
    });

    // Registration
    this.addRule("/api/auth/register", {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 3, // 3 registration attempts
      description: "Registration rate limiting",
    });

    // API endpoints - general limitations
    this.addRule("/api/", {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 100, // 100 requests per minute
      description: "General API rate limiting",
    });

    // Static files - softer limitations
    this.addRule("/_next/", {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 1000, // 1000 requests per minute
      description: "Static files rate limiting",
    });
  }

  /**
   * Add rate limiting rule
   */
  addRule(endpoint: string, config: RateLimitConfig): void {
    this.rules.set(endpoint, config);
  }

  /**
   * Check rate limit for request
   */
  checkRateLimit(endpoint: string, identifier: string): RateLimitResult {
    const rule = this.findMatchingRule(endpoint);
    if (!rule) {
      return { allowed: true, remaining: -1, resetTime: -1 };
    }

    const key = `${identifier}:${endpoint}`;
    const now = Date.now();
    const current = this.requestCounts.get(key);

    if (!current || now > current.resetTime) {
      // Create new counter
      this.requestCounts.set(key, {
        count: 1,
        resetTime: now + rule.windowMs,
      });
      return {
        allowed: true,
        remaining: rule.maxRequests - 1,
        resetTime: now + rule.windowMs,
      };
    }

    if (current.count >= rule.maxRequests) {
      // Limit exceeded
      this.logRateLimitExceeded(endpoint, identifier, rule);
      return { allowed: false, remaining: 0, resetTime: current.resetTime };
    }

    // Increment counter
    current.count++;
    this.requestCounts.set(key, current);

    return {
      allowed: true,
      remaining: rule.maxRequests - current.count,
      resetTime: current.resetTime,
    };
  }

  /**
   * Find matching rule for endpoint
   */
  private findMatchingRule(endpoint: string): RateLimitConfig | undefined {
    for (const [ruleEndpoint, config] of this.rules) {
      if (endpoint.startsWith(ruleEndpoint)) {
        return config;
      }
    }
    return undefined;
  }

  /**
   * Log rate limit exceeded
   */
  private logRateLimitExceeded(
    endpoint: string,
    identifier: string,
    rule: RateLimitConfig
  ): void {
    if (this.securityLogger) {
      this.securityLogger.rateLimitExceeded(endpoint, identifier);
    }

    console.warn(`[RATE LIMIT] Exceeded for ${endpoint} by ${identifier}`, {
      endpoint,
      identifier,
      rule: rule.description,
      windowMs: rule.windowMs,
      maxRequests: rule.maxRequests,
    });
  }

  /**
   * Get rate limiting statistics
   */
  getStats(): Record<string, RateLimitStats> {
    const stats: Record<string, RateLimitStats> = {};

    for (const [key, value] of this.requestCounts) {
      const [, endpoint] = key.split(":"); // Use _ for unused variable
      if (!stats[endpoint]) {
        stats[endpoint] = { totalRequests: 0, activeSessions: 0 };
      }
      stats[endpoint].totalRequests += value.count;
      stats[endpoint].activeSessions++;
    }

    return stats;
  }

  /**
   * Reset counters for specific identifier
   */
  resetCounters(identifier: string): void {
    for (const [key] of this.requestCounts) {
      if (key.startsWith(`${identifier}:`)) {
        this.requestCounts.delete(key);
      }
    }
  }

  /**
   * Reset all counters
   */
  resetAllCounters(): void {
    this.requestCounts.clear();
  }

  /**
   * Periodic cleanup of expired entries
   */
  private startCleanupInterval(): void {
    try {
      this.cleanupInterval = setInterval(() => {
        try {
          const now = Date.now();
          for (const [key, value] of this.requestCounts) {
            if (now > value.resetTime) {
              this.requestCounts.delete(key);
            }
          }
        } catch (error) {
          console.error("[RATE LIMITER] Error during cleanup:", error);
        }
      }, 60000); // Every minute
    } catch (error) {
      console.error("[RATE LIMITER] Failed to start cleanup interval:", error);
    }
  }

  /**
   * Stop cleanup interval
   */
  stopCleanupInterval(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  /**
   * Set security logger
   */
  setSecurityLogger(logger: typeof securityLogger): void {
    this.securityLogger = logger;
  }

  /**
   * Cleanup resources on destruction
   */
  destroy(): void {
    this.stopCleanupInterval();
    this.requestCounts.clear();
    this.rules.clear();
    this.securityLogger = null;
  }
}

export const rateLimiter = RateLimiter.getInstance();

/**
 * Middleware for Next.js API routes
 */
export function rateLimitMiddleware(
  handler: (
    req: NextApiRequest,
    res: NextApiResponse
  ) => Promise<NextApiResponse> | NextApiResponse,
  endpoint: string
) {
  return async (
    req: NextApiRequest,
    res: NextApiResponse
  ): Promise<NextApiResponse> => {
    try {
      // Get identifier (IP address or user ID)
      const identifier = getClientIdentifier(req);

      // Check rate limit
      const rateLimitResult = rateLimiter.checkRateLimit(endpoint, identifier);

      if (!rateLimitResult.allowed) {
        // Set rate limiting headers
        res.setHeader("X-RateLimit-Limit", "rate limit exceeded");
        res.setHeader(
          "X-RateLimit-Remaining",
          rateLimitResult.remaining.toString()
        );
        res.setHeader(
          "X-RateLimit-Reset",
          new Date(rateLimitResult.resetTime).toISOString()
        );
        res.setHeader(
          "Retry-After",
          Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString()
        );

        return res.status(429).json({
          error: "Too Many Requests",
          message: "Rate limit exceeded. Please try again later.",
          retryAfter: Math.ceil(
            (rateLimitResult.resetTime - Date.now()) / 1000
          ),
        });
      }

      // Set headers for successful request
      res.setHeader("X-RateLimit-Limit", "OK");
      res.setHeader(
        "X-RateLimit-Remaining",
        rateLimitResult.remaining.toString()
      );
      res.setHeader(
        "X-RateLimit-Reset",
        new Date(rateLimitResult.resetTime).toISOString()
      );

      // Continue with handler execution
      return handler(req, res);
    } catch (error) {
      console.error("[RATE LIMIT MIDDLEWARE] Error:", error);

      // In case of error, skip rate limiting and continue execution
      return handler(req, res);
    }
  };
}

/**
 * Get client identifier from request
 */
function getClientIdentifier(req: NextApiRequest): string {
  const forwardedFor = req.headers["x-forwarded-for"];
  const realIp = req.headers["x-real-ip"];

  if (forwardedFor) {
    // x-forwarded-for may contain multiple IPs separated by comma
    const ips = Array.isArray(forwardedFor)
      ? forwardedFor[0]?.split(",")[0]?.trim()
      : forwardedFor.split(",")[0]?.trim();

    if (ips) return ips;
  }

  if (realIp) {
    return Array.isArray(realIp) ? realIp[0] : realIp;
  }

  if (req.connection?.remoteAddress) {
    return req.connection.remoteAddress;
  }

  if (req.socket?.remoteAddress) {
    return req.socket.remoteAddress;
  }

  return "unknown";
}
