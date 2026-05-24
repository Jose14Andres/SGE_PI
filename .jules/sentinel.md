## 2024-05-20 - [Safeguarding Mock Credentials from Production]
**Vulnerability:** The application contained hardcoded mock credentials (including hashes that were easily crackable) loaded into the main authentication state unconditionally. In production, this allows any user to gain administrative access by guessing or cracking the mock credentials.
**Learning:** Hardcoded credentials meant for development and testing should never be bundled into the production state. Even if the application lacks a real backend, shipping mock administrator credentials exposes the system.
**Prevention:** Always conditionally load mock data using environment variables (e.g., `import.meta.env.DEV` in Vite) to ensure test credentials are not available in production builds.

## 2024-05-24 - [Preventing Mass Assignment in Frontend State]
**Vulnerability:** The application used an unbounded spread operator (`{ ...prev, ...fields }`) to update the mocked database entities (like user profiles) in the frontend state based on user input. This allowed a malicious user to craft a payload that overwrote sensitive fields, such as escalating their `role` from 'Alumno' to 'Administrador'.
**Learning:** Mass assignment vulnerabilities are not exclusively a backend concern. When managing a mocked backend entirely in frontend state, the frontend acts as the data layer and is susceptible to the same injection attacks if input is blindly spread into the state object.
**Prevention:** Always explicitly extract, filter, and validate permitted fields from user input before applying them to the state (e.g., `const { nombre, apellido, email } = fields`), rather than blindly trusting and spreading the entire input object.
