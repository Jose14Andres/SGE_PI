## 2024-05-20 - [Safeguarding Mock Credentials from Production]
**Vulnerability:** The application contained hardcoded mock credentials (including hashes that were easily crackable) loaded into the main authentication state unconditionally. In production, this allows any user to gain administrative access by guessing or cracking the mock credentials.
**Learning:** Hardcoded credentials meant for development and testing should never be bundled into the production state. Even if the application lacks a real backend, shipping mock administrator credentials exposes the system.
**Prevention:** Always conditionally load mock data using environment variables (e.g., `import.meta.env.DEV` in Vite) to ensure test credentials are not available in production builds.

## 2024-05-21 - [Missing Rate Limiting on Login]
**Vulnerability:** The login endpoint in `src/components/Auth.jsx` did not have any mechanism to restrict the number of failed login attempts, enabling brute-force and credential-stuffing attacks.
**Learning:** Even in pure frontend applications, basic defense-in-depth measures like rate limiting login attempts on the client side add a layer of friction against automated attacks, though server-side enforcement remains essential for true security.
**Prevention:** Implement account lockout mechanisms (e.g., locking out after a certain number of failed attempts) on sensitive endpoints to mitigate brute-force attacks.
