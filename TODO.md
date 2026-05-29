# TODO - Production auth flow fixes

## Step 1
Inspect and confirm backend runtime errors source for `/api/auth/google` and `/api/auth/login`.
- [x] Read backend: server.js, authController.js, firebaseAdmin.js, authRoutes.js, User model, authMiddleware.
- [x] Read frontend: authServices.js, axiosInstance.js, apiPaths.js, firebase.js.

## Step 2
Harden and instrument backend
- [x] Add global Express error handler + correlation id middleware.
- [ ] Add `/api/auth/health` route.
- [ ] Improve firebaseAdmin.js env logging + clearer init errors.
- [ ] Improve authController.js logging and production-safe responses.


## Step 3
Validate frontend-backend integration
- [x] Ensure frontend posts correct payload to backend routes.
- [ ] Add request URL/body-size logs in authServices.js (token length only).
- [ ] Add backend CORS allow Authorization header.


## Step 4
Deployment hardening for Render
- [ ] Validate required env var names used by backend at runtime.
- [ ] Ensure server uses correct PORT and does not crash.

## Step 5
Run local tests
- [ ] Start backend locally and verify `/api/auth/health`, `/api/auth/google`, `/api/auth/login`.

## Step 6
GitHub workflow
- [ ] Commit changes with clean message.
- [ ] Push to GitHub automatically.

