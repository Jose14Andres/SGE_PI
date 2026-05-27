## 2024-05-20 - [Safeguarding Mock Credentials from Production]
**Vulnerability:** The application contained hardcoded mock credentials (including hashes that were easily crackable) loaded into the main authentication state unconditionally. In production, this allows any user to gain administrative access by guessing or cracking the mock credentials.
**Learning:** Hardcoded credentials meant for development and testing should never be bundled into the production state. Even if the application lacks a real backend, shipping mock administrator credentials exposes the system.
**Prevention:** Always conditionally load mock data using environment variables (e.g., `import.meta.env.DEV` in Vite) to ensure test credentials are not available in production builds.
Hardcoded test password vulnerability in Auth.jsx removed by allowing bypass in App.jsx via DEMO_USERS checks in dev mode.

## 2024-05-25 - [Missing Server-Side Validation Simulation]
**Vulnerability:** The `handleLogin` function in the client-side mock backend omitted input validation (type, length, valid options) before processing inputs, leaving the application vulnerable to DoS attacks via extremely large payload hashing or unexpected behavior from incorrect types.
**Learning:** Always validate input lengths, types, and domains for both authentication boundaries and internal states, even if it is a simulated frontend mock.
**Prevention:** Incorporate boundary checks and explicit type checking for variables handling authentication inputs before any operations like hashing or database lookups.
