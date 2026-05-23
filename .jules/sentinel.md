## 2024-05-20 - [Safeguarding Mock Credentials from Production]
**Vulnerability:** The application contained hardcoded mock credentials (including hashes that were easily crackable) loaded into the main authentication state unconditionally. In production, this allows any user to gain administrative access by guessing or cracking the mock credentials.
**Learning:** Hardcoded credentials meant for development and testing should never be bundled into the production state. Even if the application lacks a real backend, shipping mock administrator credentials exposes the system.
**Prevention:** Always conditionally load mock data using environment variables (e.g., `import.meta.env.DEV` in Vite) to ensure test credentials are not available in production builds.

## 2024-05-21 - [Preventing Mass Assignment in Frontend State]
**Vulnerability:** The `handleUpdateProfile` function used an unbounded spread operator (`{ ...prev, ...fields }`) to merge user-provided updates into the application's global `user` state. A malicious user could potentially inject fields such as `role: 'Administrador'` by manipulating the frontend state update, thus achieving privilege escalation.
**Learning:** Using unrestrained spread operations directly on unvalidated input objects (like those passed from UI components) exposes frontend state entities to mass assignment vulnerabilities, bypassing intended data schemas and permissions.
**Prevention:** Always extract and filter permitted properties explicitly from input data before applying state updates (e.g., using destructuring to extract only safe fields like `nombre`, `apellido`, and `email`) rather than merging the entire object payload.
