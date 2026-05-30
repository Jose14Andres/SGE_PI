## 2024-05-20 - [Safeguarding Mock Credentials from Production]
**Vulnerability:** The application contained hardcoded mock credentials (including hashes that were easily crackable) loaded into the main authentication state unconditionally. In production, this allows any user to gain administrative access by guessing or cracking the mock credentials.
**Learning:** Hardcoded credentials meant for development and testing should never be bundled into the production state. Even if the application lacks a real backend, shipping mock administrator credentials exposes the system.
**Prevention:** Always conditionally load mock data using environment variables (e.g., `import.meta.env.DEV` in Vite) to ensure test credentials are not available in production builds.

## 2024-05-21 - [Missing Rate Limiting on Login]
**Vulnerability:** The login endpoint in `src/components/Auth.jsx` did not have any mechanism to restrict the number of failed login attempts, enabling brute-force and credential-stuffing attacks.
**Learning:** Even in pure frontend applications, basic defense-in-depth measures like rate limiting login attempts on the client side add a layer of friction against automated attacks, though server-side enforcement remains essential for true security.
**Prevention:** Implement account lockout mechanisms (e.g., locking out after a certain number of failed attempts) on sensitive endpoints to mitigate brute-force attacks.
## 2024-05-20 - [Prevent Mass Assignment in State Updates]
**Vulnerability:** The application was vulnerable to Mass Assignment in the `handleUpdateProfile` function, where arbitrary fields from user input were blindly spread into the application state object representing the user. This allowed users to potentially modify read-only properties like `id`, `role`, or `password` by sending extra fields in the update payload.
**Learning:** Blindly spreading user input into sensitive state objects (`{ ...prev, ...fields }`) bypasses intended access controls and opens the door for mass assignment vulnerabilities, even on the frontend.
**Prevention:** Always explicitly define and filter the allowed fields from incoming user data before merging it into critical application state.
## 2024-05-21 - [Preventing Mass Assignment in Frontend State]
**Vulnerability:** The `handleUpdateProfile` function used an unbounded spread operator (`{ ...prev, ...fields }`) to merge user-provided updates into the application's global `user` state. A malicious user could potentially inject fields such as `role: 'Administrador'` by manipulating the frontend state update, thus achieving privilege escalation.
**Learning:** Using unrestrained spread operations directly on unvalidated input objects (like those passed from UI components) exposes frontend state entities to mass assignment vulnerabilities, bypassing intended data schemas and permissions.
**Prevention:** Always extract and filter permitted properties explicitly from input data before applying state updates (e.g., using destructuring to extract only safe fields like `nombre`, `apellido`, and `email`) rather than merging the entire object payload.
## 2024-05-24 - [Preventing Mass Assignment in Frontend State]
**Vulnerability:** The application used an unbounded spread operator (`{ ...prev, ...fields }`) to update the mocked database entities (like user profiles) in the frontend state based on user input. This allowed a malicious user to craft a payload that overwrote sensitive fields, such as escalating their `role` from 'Alumno' to 'Administrador'.
**Learning:** Mass assignment vulnerabilities are not exclusively a backend concern. When managing a mocked backend entirely in frontend state, the frontend acts as the data layer and is susceptible to the same injection attacks if input is blindly spread into the state object.
**Prevention:** Always explicitly extract, filter, and validate permitted fields from user input before applying them to the state (e.g., `const { nombre, apellido, email } = fields`), rather than blindly trusting and spreading the entire input object.
## 2026-05-25 - [Preventing Mass Assignment in State Updates]
**Vulnerability:** A profile update function used `{ ...prev, ...fields }` to merge user-provided updates directly into the global user state. This could allow an attacker to alter protected attributes, such as injecting `role: 'Administrador'` to elevate their own privileges.
**Learning:** Even in purely frontend or mocked applications, bounding and explicitly extracting user inputs before merging them into sensitive state objects is critical to prevent state-based privilege escalation.
**Prevention:** Never use unbounded spread operators for state updates with external input. Always map or extract explicitly permitted fields into a safe object before merging.
Hardcoded test password vulnerability in Auth.jsx removed by allowing bypass in App.jsx via DEMO_USERS checks in dev mode.

## 2024-05-25 - [Missing Server-Side Validation Simulation]
**Vulnerability:** The `handleLogin` function in the client-side mock backend omitted input validation (type, length, valid options) before processing inputs, leaving the application vulnerable to DoS attacks via extremely large payload hashing or unexpected behavior from incorrect types.
**Learning:** Always validate input lengths, types, and domains for both authentication boundaries and internal states, even if it is a simulated frontend mock.
**Prevention:** Incorporate boundary checks and explicit type checking for variables handling authentication inputs before any operations like hashing or database lookups.

## 2024-05-26 - [Missing File Size Limits on Client-Side File Processing]
**Vulnerability:** The avatar image upload component in `src/components/Profile.jsx` did not enforce any size limit before reading the file into memory via `FileReader.readAsDataURL()`. An attacker could exploit this to freeze or crash the browser by uploading excessively large files (Client-Side DoS).
**Learning:** Client-side processing of untrusted files requires the same defensive checks as server-side processing to protect against memory exhaustion.
**Prevention:** Always validate file size and type *before* initiating expensive operations like `FileReader` conversions.
