## 2024-05-20 - [Safeguarding Mock Credentials from Production]
**Vulnerability:** The application contained hardcoded mock credentials (including hashes that were easily crackable) loaded into the main authentication state unconditionally. In production, this allows any user to gain administrative access by guessing or cracking the mock credentials.
**Learning:** Hardcoded credentials meant for development and testing should never be bundled into the production state. Even if the application lacks a real backend, shipping mock administrator credentials exposes the system.
**Prevention:** Always conditionally load mock data using environment variables (e.g., `import.meta.env.DEV` in Vite) to ensure test credentials are not available in production builds.

## 2024-05-20 - [Prevent Mass Assignment in State Updates]
**Vulnerability:** The application was vulnerable to Mass Assignment in the `handleUpdateProfile` function, where arbitrary fields from user input were blindly spread into the application state object representing the user. This allowed users to potentially modify read-only properties like `id`, `role`, or `password` by sending extra fields in the update payload.
**Learning:** Blindly spreading user input into sensitive state objects (`{ ...prev, ...fields }`) bypasses intended access controls and opens the door for mass assignment vulnerabilities, even on the frontend.
**Prevention:** Always explicitly define and filter the allowed fields from incoming user data before merging it into critical application state.
