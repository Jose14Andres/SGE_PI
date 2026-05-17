## 2025-05-17 - [Remove Hardcoded Passwords in Source]
**Vulnerability:** The codebase had hardcoded plaintext credentials (`admin123`, etc.) in the demo users array in `src/data.js` and login demo features in `src/components/Auth.jsx`.
**Learning:** Even in frontend mock applications, embedding static credentials is a bad practice that sets bad patterns and could leak test info if copied to production templates.
**Prevention:** Remove static plaintext passwords; implement mock authentication based on DEV environment flags (`import.meta.env.DEV`), eliminating the need to store dummy strings directly.
