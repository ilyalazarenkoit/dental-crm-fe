enum ROUTES {
  landing = "/",
  signin = "/signin",
  register = "/register",
  recovery = "/reset-password",
  setPassword = "/set-password",
  passwordChanged = "/password-changed",
  notFound = "/not-found",
  rateLimit = "/rate-limit-exceeded",
  resendVerification = "/resend-verification",
  verifyEmail = "/verify-email",

  // sidebar routes
  home = "/home",
  scheduling = "/scheduling",
  patients = "/patients",
  cards = "/cards",

  management = "/management",
  analytics = "/analytics",

  profile = "/profile",
  // accounting = "/accounting",
  // distribution = "/distribution",
  // orders = "/orders",

  // productManagement = "/product-management",
  // service = "/service",

  // notifications = "/notifications",

  // startseite routes
  // tasks = "/tasks",
  // approvals = "/approvals",
  // evaluations = "/evaluations",
  // distribution routes
  // leads = "/leads",
  // deals = "/deals",
}

export { ROUTES };
