- [x] Inspect email-related code in backend/services/emailServices.js
- [x] Update transporter verification logic (avoid permanent cached failure; retry on next send)
- [x] Add provider-specific env validation and clearer error messages (include host/port/provider, avoid secrets)
- [x] Make transporter TLS/secure defaults safer for common SMTP ports
- [ ] Run local test route /test-email (or register/login) and verify logs show expected behavior


