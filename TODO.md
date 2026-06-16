# TODO - Validation, LLM hardening, caching, rate limits, audit logs, Career Advisor fix

## Plan steps
- [ ] Inspect route wiring + Career Advisor frontend/service payloads
- [ ] Add Zod request validation (schemas + validate middleware)
- [ ] Attach validation middleware to all controllers/routes
- [ ] Add AI response schemas and validate after JSON.parse
- [ ] Implement retry/backoff for temporary LLM failures
- [ ] Implement caching for repeated prompts
- [ ] Add rate limiting middleware
- [ ] Add audit logging middleware (correlationId/userId/route/duration/status)
- [x] Fix Career Advisor submit error (align frontend payload ↔ backend contract)

- [ ] Run basic backend start / sanity requests
- [ ] Run frontend build and verify Career Advisor submit

