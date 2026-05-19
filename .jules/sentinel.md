## 2025-05-17 - [Remove Hardcoded Passwords in Source]
**Vulnerability:** The codebase had hardcoded plaintext credentials (`admin123`, etc.) in the demo users array in `src/data.js` and login demo features in `src/components/Auth.jsx`.
**Learning:** Even in frontend mock applications, embedding static credentials is a bad practice that sets bad patterns and could leak test info if copied to production templates.
**Prevention:** Remove static plaintext passwords; implement mock authentication based on DEV environment flags (`import.meta.env.DEV`), eliminating the need to store dummy strings directly.
## 2024-05-18 - [Critical] Implement frontend password hashing
**Vulnerability:** Passwords for demo users were stored in plaintext in the codebase and verified using plaintext comparison.
**Learning:** In purely frontend applications that rely on mock credentials, it's still crucial to hash passwords. Using Web Crypto API (`crypto.subtle`) for SHA-256 hashing allows secure client-side password handling without needing external libraries. This change required converting synchronous login logic into asynchronous.
**Prevention:** Avoid plaintext credentials anywhere in the code. When building demo or mock applications without a backend, utilize native browser Web Crypto API to hash passwords before storing or comparing them.
