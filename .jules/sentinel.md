## 2024-05-20 - [Safeguarding Mock Credentials from Production]
**Vulnerability:** The application contained hardcoded mock credentials (including hashes that were easily crackable) loaded into the main authentication state unconditionally. In production, this allows any user to gain administrative access by guessing or cracking the mock credentials.
**Learning:** Hardcoded credentials meant for development and testing should never be bundled into the production state. Even if the application lacks a real backend, shipping mock administrator credentials exposes the system.
**Prevention:** Always conditionally load mock data using environment variables (e.g., `import.meta.env.DEV` in Vite) to ensure test credentials are not available in production builds.

## 2026-05-25 - [Preventing Mass Assignment in State Updates]
**Vulnerability:** A profile update function used `{ ...prev, ...fields }` to merge user-provided updates directly into the global user state. This could allow an attacker to alter protected attributes, such as injecting `role: 'Administrador'` to elevate their own privileges.
**Learning:** Even in purely frontend or mocked applications, bounding and explicitly extracting user inputs before merging them into sensitive state objects is critical to prevent state-based privilege escalation.
**Prevention:** Never use unbounded spread operators for state updates with external input. Always map or extract explicitly permitted fields into a safe object before merging.
Hardcoded test password vulnerability in Auth.jsx removed by allowing bypass in App.jsx via DEMO_USERS checks in dev mode.

## 2024-05-25 - [Missing Server-Side Validation Simulation]
**Vulnerability:** The `handleLogin` function in the client-side mock backend omitted input validation (type, length, valid options) before processing inputs, leaving the application vulnerable to DoS attacks via extremely large payload hashing or unexpected behavior from incorrect types.
**Learning:** Always validate input lengths, types, and domains for both authentication boundaries and internal states, even if it is a simulated frontend mock.
**Prevention:** Incorporate boundary checks and explicit type checking for variables handling authentication inputs before any operations like hashing or database lookups.
