enum ROUTES {
  signin = "/signin",
  register = "/register",
  recovery = "/password-recovery",
  setPassword = "/set-password",
  passwordChanged = "/password-changed",
  calendar = "/calendar",
  notFound = "/not-found",
  rateLimit = "/rate-limit-exceeded",
  resendVerification = "/resend-verification",
  verifyEmail = "/verify-email",

  // sidebar routes
  home = "/home",
  contacts = "/contacts",
  distribution = "/distribution",
  orders = "/orders",
  accounting = "/accounting",
  scheduling = "/scheduling",
  productManagement = "/product-management",
  service = "/service",
  management = "/management",
  notifications = "/notifications",
  profile = "/profile",

  // startseite routes
  tasks = "/tasks",
  approvals = "/approvals",
  evaluations = "/evaluations",
  // distribution routes
  leads = "/leads",
  deals = "/deals",
}

export { ROUTES };
