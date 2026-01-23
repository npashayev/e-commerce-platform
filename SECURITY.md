# Security Policy

**Please do not report security vulnerabilities through public GitHub issues.**

## Security Measures

### Implemented Security Features

#### Infrastructure Security
-  HTTPS enforced with HSTS (max-age: 63072000 seconds)
-  Deployed on Vercel's secure infrastructure
-  Automated security scanning in CI/CD pipeline
-  Dependency vulnerability monitoring

#### Application Security
-  Content Security Policy (CSP) - Grade A
-  CORS protection with whitelisted origins
-  Rate limiting with Upstash Redis
  - 100 requests/minute for general API endpoints
  - 5 attempts/15 minutes for authentication endpoints
  - Persistent across deployments
-  Input validation using Zod schemas
-  Secure authentication with NextAuth.js
-  Role-based access control (Admin, Moderator, User)
-  Protected routes middleware

#### Security Headers
-  Content-Security-Policy
-  Strict-Transport-Security
-  X-Frame-Options: DENY
-  X-Content-Type-Options: nosniff
-  Referrer-Policy: strict-origin-when-cross-origin
-  Permissions-Policy

**Security Score: A** (verified at securityheaders.com)

### Database Security
-  MongoDB connection over TLS
-  Separate databases for production and preview environments
-  Environment-based credentials
-  Connection strings stored securely in environment variables
-  Prisma ORM for SQL injection prevention

### Authentication & Authorization
-  Session-based authentication with NextAuth.js
-  Secure password hashing (bcrypt)
-  Protected API routes
-  Role-based access control (RBAC)
-  CSRF protection
-  Rate limiting on authentication endpoints

### Rate Limiting
-  **API routes:** 100 requests per minute per IP
-  **Auth endpoints:** 5 attempts per 15 minutes per IP
-  Powered by Upstash Redis (persistent across deployments)
-  Standard X-RateLimit-* headers in responses
-  Automatic retry-after information

### Development Practices
-  Automated ESLint checks
-  TypeScript strict mode enabled
-  No secrets committed to repository
-  Automated dependency audits (npm audit)
-  CI/CD pipeline with quality gates
-  Dependency review on pull requests

## Environment Variables

**Never commit `.env` files to version control.**

Use:
- `.env.local` for local development
- Vercel environment variables for production/preview
- GitHub Secrets for CI/CD pipeline

Required environment variables are documented in `.env.example`

### Critical Variables
- `DATABASE_URL` - MongoDB connection string
- `NEXTAUTH_SECRET` - Session encryption key (min 32 characters)
- `UPSTASH_REDIS_REST_URL` - Rate limiting storage
- `UPSTASH_REDIS_REST_TOKEN` - Rate limiting authentication

## Recommended Practices

### For Developers
1. Keep dependencies up to date: `npm audit` and `npm outdated`
2. Review security advisories before updating dependencies
3. Use strong, unique API keys
4. Rotate credentials regularly (every 90 days recommended)
5. Enable 2FA on all service accounts (Vercel, GitHub, MongoDB, Upstash)
6. Never commit sensitive data or credentials
7. Use environment variables for all secrets
8. Review Zod schemas before deploying form changes

### For Administrators
1. Use strong passwords (minimum 16 characters)
2. Enable two-factor authentication on all accounts
3. Regularly review user permissions and roles
4. Monitor application logs for suspicious activity
5. Keep admin access limited to trusted personnel
6. Audit admin actions monthly
7. Review rate limit analytics in Upstash dashboard

### For End Users
1. Use strong, unique passwords
2. Enable 2FA when available
3. Do not share account credentials
4. Report suspicious activity immediately
5. Keep your browser and operating system updated

## Security Monitoring

### Automated Monitoring
- GitHub Actions security scans on every push
- Dependency vulnerability alerts via Dependabot
- npm audit in CI/CD pipeline (high severity threshold)
- Vercel deployment security checks
- Rate limit analytics in Upstash dashboard

### Manual Audits
- Quarterly security header reviews
- Monthly dependency updates
- Regular access control audits
- Annual penetration testing (recommended)

## Compliance

### E-commerce Security
- PCI DSS considerations for payment processing
- Secure transmission of payment data (HTTPS only)
- No storage of credit card information (handled by payment providers)
- Payment webhook signature verification

### Data Protection
- User data encrypted in transit (TLS 1.2+)
- Secure session management
- Privacy-focused analytics (Vercel Analytics)
- GDPR considerations for EU users
- Data retention policies

## Known Security Considerations

### Content Security Policy
- CSP includes `unsafe-inline` and `unsafe-eval` for Next.js compatibility
- This is standard for Next.js applications
- Mitigated by other security layers (input validation, CORS, rate limiting)

### Rate Limiting
- IP-based rate limiting may affect users behind shared networks (offices, universities)
- Consider implementing user-based rate limiting for authenticated requests
- Monitor Upstash analytic