/**
 * Secure Logging System for Production
 * Based on NIST SP 800-53 and OWASP Logging Cheat Sheet
 * Author: Senior Cybersecurity Engineer
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4,
  SECURITY = 5, // Special level for security events
}

export enum SecurityEventType {
  AUTH_SUCCESS = "auth_success",
  AUTH_FAILURE = "auth_failure",
  TOKEN_VALIDATION = "token_validation",
  SUSPICIOUS_ACTIVITY = "suspicious_activity",
  RATE_LIMIT_EXCEEDED = "rate_limit_exceeded",
  INVALID_ACCESS_ATTEMPT = "invalid_access_attempt",
  SESSION_MANIPULATION = "session_manipulation",
}

interface SecurityEvent {
  timestamp: string;
  eventType: SecurityEventType;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  details: Record<string, unknown>;
  severity: LogLevel;
  sessionId?: string;
}

interface SecurityMonitoring {
  Sentry?: {
    captureMessage: (
      message: string,
      options: { level: string; extra: unknown }
    ) => void;
  };
  LogRocket?: {
    track: (event: string, data: unknown) => void;
  };
}

class SecurityLogger {
  private static instance: SecurityLogger;
  private isProduction: boolean;
  private logLevel: LogLevel;
  private securityEvents: SecurityEvent[] = [];
  private maxEventsInMemory = 1000;
  private analysisInterval?: NodeJS.Timeout;

  private constructor() {
    this.isProduction = process.env.NODE_ENV === "production";
    this.logLevel = this.isProduction ? LogLevel.WARN : LogLevel.DEBUG;

    // In production, send security events to monitoring system
    if (this.isProduction) {
      this.setupSecurityMonitoring();
    }
  }

  static getInstance(): SecurityLogger {
    if (!SecurityLogger.instance) {
      SecurityLogger.instance = new SecurityLogger();
    }
    return SecurityLogger.instance;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  /**
   * Safe data sanitization for logging
   * Removes sensitive information in production
   */
  private sanitizeData(data: unknown): unknown {
    if (this.isProduction) {
      const sensitiveFields = [
        "token",
        "password",
        "jwt",
        "accessToken",
        "refreshToken",
        "secret",
        "key",
        "credential",
        "auth",
        "session",
      ];

      if (typeof data === "object" && data !== null) {
        const sanitized = { ...data } as Record<string, unknown>;
        sensitiveFields.forEach((field) => {
          if (sanitized[field]) {
            sanitized[field] = "[REDACTED]";
          }
        });
        return sanitized;
      }
    }
    return data;
  }

  /**
   * Logging security events with detailed information
   */
  security(
    eventType: SecurityEventType,
    details: Record<string, unknown>,
    userId?: string,
    sessionId?: string
  ): void {
    const securityEvent: SecurityEvent = {
      timestamp: new Date().toISOString(),
      eventType,
      userId,
      sessionId,
      details: this.sanitizeData(details) as Record<string, unknown>,
      severity: LogLevel.SECURITY,
    };

    // Add to memory for analysis
    this.securityEvents.push(securityEvent);
    if (this.securityEvents.length > this.maxEventsInMemory) {
      this.securityEvents.shift();
    }

    // In production, send to monitoring system
    if (this.isProduction) {
      this.sendToSecurityMonitoring(securityEvent);
    }

    // Log to console with security prefix
    console.warn(`[SECURITY] ${eventType}:`, this.sanitizeData(details));
  }

  /**
   * Logging authentication attempts
   */
  authAttempt(
    success: boolean,
    details: Record<string, unknown>,
    userId?: string
  ): void {
    const eventType = success
      ? SecurityEventType.AUTH_SUCCESS
      : SecurityEventType.AUTH_FAILURE;

    this.security(
      eventType,
      {
        success,
        ...details,
        timestamp: new Date().toISOString(),
      },
      userId
    );
  }

  /**
   * Logging suspicious activity
   */
  suspiciousActivity(
    activity: string,
    details: Record<string, unknown>,
    userId?: string
  ): void {
    this.security(
      SecurityEventType.SUSPICIOUS_ACTIVITY,
      {
        activity,
        ...details,
        timestamp: new Date().toISOString(),
      },
      userId
    );
  }

  /**
   * Logging rate limit exceeded
   */
  rateLimitExceeded(
    endpoint: string,
    ipAddress: string,
    userId?: string
  ): void {
    this.security(
      SecurityEventType.RATE_LIMIT_EXCEEDED,
      {
        endpoint,
        ipAddress,
        timestamp: new Date().toISOString(),
      },
      userId
    );
  }

  /**
   * Logging unauthorized access attempts
   */
  invalidAccessAttempt(
    resource: string,
    details: Record<string, unknown>
  ): void {
    this.security(SecurityEventType.INVALID_ACCESS_ATTEMPT, {
      resource,
      ...details,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Logging session manipulations
   */
  sessionManipulation(
    action: string,
    details: Record<string, unknown>,
    userId?: string
  ): void {
    this.security(
      SecurityEventType.SESSION_MANIPULATION,
      {
        action,
        ...details,
        timestamp: new Date().toISOString(),
      },
      userId
    );
  }

  /**
   * Analysis of security events to detect attack patterns
   */
  analyzeSecurityPatterns(): void {
    if (this.securityEvents.length === 0) return;

    const recentEvents = this.securityEvents.filter(
      (event) =>
        Date.now() - new Date(event.timestamp).getTime() < 5 * 60 * 1000 // Last 5 minutes
    );

    // Analysis of login attempts
    const authFailures = recentEvents.filter(
      (event) => event.eventType === SecurityEventType.AUTH_FAILURE
    );

    if (authFailures.length > 5) {
      console.warn(
        "[SECURITY ALERT] Multiple authentication failures detected"
      );
      this.sendSecurityAlert("Multiple authentication failures", {
        count: authFailures.length,
        timeWindow: "5 minutes",
      });
    }

    // Analysis of suspicious activity
    const suspiciousEvents = recentEvents.filter(
      (event) => event.eventType === SecurityEventType.SUSPICIOUS_ACTIVITY
    );

    if (suspiciousEvents.length > 3) {
      console.warn("[SECURITY ALERT] High suspicious activity detected");
      this.sendSecurityAlert("High suspicious activity", {
        count: suspiciousEvents.length,
        timeWindow: "5 minutes",
      });
    }
  }

  private setupSecurityMonitoring(): void {
    // Setup periodic analysis of security events
    try {
      this.analysisInterval = setInterval(() => {
        try {
          this.analyzeSecurityPatterns();
        } catch (error) {
          console.error("[SECURITY LOGGER] Error in pattern analysis:", error);
        }
      }, 60000); // Every minute
    } catch (error) {
      console.error("[SECURITY LOGGER] Failed to setup monitoring:", error);
    }
  }

  private sendToSecurityMonitoring(event: SecurityEvent): void {
    // Integration with external monitoring systems
    try {
      if (typeof window !== "undefined") {
        const monitoring = window as unknown as SecurityMonitoring;

        // Sentry
        if (monitoring.Sentry) {
          monitoring.Sentry.captureMessage(
            `Security Event: ${event.eventType}`,
            {
              level: "warning",
              extra: event,
            }
          );
        }

        // LogRocket
        if (monitoring.LogRocket) {
          monitoring.LogRocket.track("Security Event", event);
        }
      }
    } catch (error) {
      console.error("[SECURITY LOGGER] Failed to send to monitoring:", error);
    }
  }

  private sendSecurityAlert(
    message: string,
    details: Record<string, unknown>
  ): void {
    // Send security alerts
    if (this.isProduction) {
      // Here you can add integration with Slack, email, SMS
      console.error(`[SECURITY ALERT] ${message}:`, details);
    }
  }

  // Standard logging methods
  debug(message: string, data?: unknown): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.log(`[DEBUG] ${message}`, this.sanitizeData(data));
    }
  }

  info(message: string, data?: unknown): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.log(`[INFO] ${message}`, this.sanitizeData(data));
    }
  }

  warn(message: string, data?: unknown): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(`[WARN] ${message}`, this.sanitizeData(data));
    }
  }

  error(message: string, data?: unknown): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(`[ERROR] ${message}`, this.sanitizeData(data));
    }
  }

  critical(message: string, data?: unknown): void {
    if (this.shouldLog(LogLevel.CRITICAL)) {
      console.error(`[CRITICAL] ${message}`, this.sanitizeData(data));
      this.sendSecurityAlert(message, data as Record<string, unknown>);
    }
  }

  // Cleanup method
  destroy(): void {
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
      this.analysisInterval = undefined;
    }
  }
}

export const securityLogger = SecurityLogger.getInstance();
