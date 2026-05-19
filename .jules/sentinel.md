## 2024-05-18 - [Critical] Implement frontend password hashing
**Vulnerability:** Passwords for demo users were stored in plaintext in the codebase and verified using plaintext comparison.
**Learning:** In purely frontend applications that rely on mock credentials, it's still crucial to hash passwords. Using Web Crypto API (`crypto.subtle`) for SHA-256 hashing allows secure client-side password handling without needing external libraries. This change required converting synchronous login logic into asynchronous.
**Prevention:** Avoid plaintext credentials anywhere in the code. When building demo or mock applications without a backend, utilize native browser Web Crypto API to hash passwords before storing or comparing them.
