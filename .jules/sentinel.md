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

## 2026-05-29 - [Preventing Role-Based Access Control (RBAC) Bypass in Frontend Auth]
**Vulnerability:** The client-side `handleLogin` function did not verify that the role requested by the user during login actually matched the user's provisioned role stored in the system state. This allowed an attacker to log in to another role (e.g., an 'Alumno' requesting the 'Administrador' role) and gain unauthorized privileges within the UI because the frontend application incorrectly trusted the requested role instead of the stored role.
**Learning:** Even when authentication is mocked on the frontend, enforcing strict role validation is critical. Trusting user-provided input over stored system state for authorization claims bypasses RBAC entirely and leads to privilege escalation.
**Prevention:** Always validate that the requested role (or any requested authorization scope) explicitly matches the authoritative role stored for the authenticated user before granting access and establishing the user session (`if (found.role !== requestedRole) return false;`).
## 2024-05-26 - [Missing File Size Limits on Client-Side File Processing]
**Vulnerability:** The avatar image upload component in `src/components/Profile.jsx` did not enforce any size limit before reading the file into memory via `FileReader.readAsDataURL()`. An attacker could exploit this to freeze or crash the browser by uploading excessively large files (Client-Side DoS).
**Learning:** Client-side processing of untrusted files requires the same defensive checks as server-side processing to protect against memory exhaustion.
**Prevention:** Always validate file size and type *before* initiating expensive operations like `FileReader` conversions.
## 2024-05-30 - [Strict Role Validation in Authentication Mock]
**Vulnerability:** The client-side mock backend verified credentials (email and password) but accepted the user's `role` dynamically based on the requested role, overriding their actual role stored in the mock database. This allows privilege escalation or Authorization Bypass, meaning an 'Alumno' could login with their credentials and choose 'Administrador' from the role dropdown, and be granted Admin privileges.
**Learning:** Never blindly trust user-supplied roles or privileges during authentication, even in mock logic. Always assert that the requested role strictly matches the server-side (or stored mock database) role.
**Prevention:** In authentication functions, add an explicit check verifying the requested role against the stored role: `if (!found || found.role !== role) return false;`.
## 2024-06-03 - [Missing File Size Limits on Client-Side File Processing]
**Vulnerability:** The avatar image upload component in `src/components/Profile.jsx` did not enforce any size limit before reading the file into memory via `FileReader.readAsDataURL()`. An attacker could exploit this to freeze or crash the browser by uploading excessively large files (Client-Side DoS).
**Learning:** Client-side processing of untrusted files requires the same defensive checks as server-side processing to protect against memory exhaustion.
**Prevention:** Always validate file size and type *before* initiating expensive operations like `FileReader` conversions.
## 2024-06-03 - [Securing Frontend Session Persistence]
**Vulnerability:** User sessions were previously non-persistent across tab reloads, but standard unencrypted `localStorage` or `sessionStorage` implementations are vulnerable to Local State Tampering and Session Hijacking.
**Learning:** Even in purely frontend simulated environments, persisting sensitive session data requires integrity checks. An attacker could manually alter the JSON object in `sessionStorage` to change their role and achieve horizontal/vertical privilege escalation.
**Prevention:** Implement a cryptographic integrity check (e.g., a lightweight HMAC) when storing sessions locally. Always re-verify the signature and cross-reference roles against the internal mock data when restoring the session from storage. Use `sessionStorage` instead of `localStorage` to ensure the lifecycle strictly ends when the browser tab is closed.

## 2024-05-24 - [Syntax Error Lockout Bypass]
**Vulnerability:** A syntax error within the failed attempts counter bypassed the UI lockout mechanism.
**Learning:** The `setAttempts` undefined variable error caused an implicit bypass/fail-open of the application's rate-limiting.
**Prevention:** Ensure strict linting is passed and components are properly tested for edge cases.

## 2024-06-05 - [Missing Input Length Limits]
**Vulnerability:** User-provided inputs in forms (such as `Profile.jsx` and CRUD modules) were not constrained by `maxLength` attributes in the UI layer. This allowed potential client-side DoS (Denial of Service) attacks or application slowdowns where massive strings could be pasted into fields, consuming excessive memory and CPU resources, particularly during validation and controlled component re-renders.
**Learning:** Client-side forms should enforce explicit maximum length limits on input fields (`maxLength="..."`) to protect against basic resource-exhaustion attacks, ensuring stability even before input reaches the server validation.
**Prevention:** Always define and apply logical `maxLength` restrictions to text/number and password inputs across UI components to reject abusively large input payloads at the browser level.
## 2024-06-08 - [Dynamic Secret Key Generation for Mock Sessions]
**Vulnerability:** The cryptographic utility `signSession` used a hardcoded, static plaintext secret (`MOCK_SESSION_SECRET = 'sge_secure_session_secret_2024'`) to sign the mock backend's sessions. An attacker inspecting the frontend bundle could extract this key to forge valid session signatures (Tampering), escalating privileges via local storage modification.
**Learning:** Hardcoding static cryptographic keys within frontend bundles defeats the purpose of HMACs, as the keys are fully visible to end users.
**Prevention:** In mock or single-lifecycle frontend environments that enforce session integrity, keys should be generated dynamically at runtime (`window.crypto.getRandomValues`) or bound strictly to server-provided environment variables, never hardcoded in plaintext.

## 2025-02-23 - [Preventing Information Disclosure in Authentication]
**Vulnerability:** The application originally provided specific error messages during authentication and password changes (e.g., 'La contraseña actual es incorrecta.'), which could allow an attacker to enumerate valid usernames or discern the exact reason for failure. Additionally, uncaught errors in async operations could potentially leak system traces to the UI.
**Learning:** To mitigate Information Disclosure, all authentication-related error messages must be generic, and raw system exceptions should be masked safely.
**Prevention:** Always use generic failure messages like 'Credenciales incorrectas o rol no válido.' and wrap asynchronous operations in  blocks to swallow underlying errors before they reach the user interface.

## 2025-02-23 - [Preventing Information Disclosure in Authentication]
**Vulnerability:** The application originally provided specific error messages during authentication and password changes (e.g., 'La contraseña actual es incorrecta.'), which could allow an attacker to enumerate valid usernames or discern the exact reason for failure. Additionally, uncaught errors in async operations could potentially leak system traces to the UI.
**Learning:** To mitigate Information Disclosure, all authentication-related error messages must be generic, and raw system exceptions should be masked safely.
**Prevention:** Always use generic failure messages like 'Credenciales incorrectas o rol no válido.' and wrap asynchronous operations in `try...catch` blocks to swallow underlying errors before they reach the user interface.

## 2025-02-23 - [Refactored Fragile Sanitization & Hardened Crypto Fallback]
**Vulnerability:** The application used a fragile regex (`val.replace(/<[^>]*>?/gm, '')`) for input sanitization, which could lead to bypasses or data corruption. Furthermore, the mock HMAC session generation (`src/utils/crypto.js`) fell back to the insecure `Math.random()` if a cryptographic random generator was not found.
**Learning:** In purely React-rendered apps, relying on React's automatic contextual output escaping is significantly safer than implementing fragile custom regex-based tag-stripping (unless `dangerouslySetInnerHTML` is explicitly used). Also, cryptographic processes must fail-securely rather than silently downgrading to insecure algorithms.
**Prevention:** Remove custom tag-stripping and delegate XSS protection to React’s renderer. Ensure any fallback for cryptographic material generation throws a hard error rather than utilizing `Math.random()`.

## 2026-06-21 - [Preventing Information Disclosure in Frontend Session State]
**Vulnerability:** The `handleLogin` function was passing the entire `foundUser` object (which included the user's SHA-256 password hash from the mock database) directly into the `sessionUser` state. This object was then stringified and stored in `sessionStorage` in plain text, exposing the password hash to potential XSS attacks or local physical inspection.
**Learning:** Sensitive data, such as password hashes, should never be stored in persistent client-side storage or global UI state, as it provides no functional value to the frontend session and significantly increases the risk of Information Disclosure.
**Prevention:** Always strip sensitive fields (like `password`) from user objects using destructuring (`const { password: _, ...sessionUser } = foundUser;`) before persisting them to state managers or `sessionStorage`.

## 2026-06-21 - [Avoiding Security Theater in Frontend UI Components]
**Vulnerability:** A previous attempt to fix Mass Assignment vulnerabilities involved filtering keys out of a generic `formData` object before it was submitted in `Modules.jsx`.
**Learning:** Filtering `formData` purely on the client-side based on visible UI fields is security theater. It provides no protection against an attacker who makes direct API requests (or modifies React state directly) and risks breaking functionality by stripping out necessary background properties (like `id` or relationship keys).
**Prevention:** True Mass Assignment protection must happen at the data access or API layer (e.g., inside `App.jsx` handlers), where explicit picking/omitting of fields can be strictly enforced based on the authoritative schema.
