# TODO: AI Career Assistant Hub

## Information gathered
- Frontend uses React + Vite + Tailwind with a custom “premium” design system in `src/index.css`.
- Existing AI features: interview question generation + concept explanations.
- Backend: Express app with protected routes, controllers, and Mongo/Mongoose models.
- No existing DB schemas for saving AI conversations/reports/history.

## Plan (file-level)
### Step 1 — Backend foundation
1. Create backend routes: `backend/routes/careerAssistantRoutes.js`.
2. Create controller: `backend/controllers/careerAssistantController.js`.
3. Create service + prompts:
   - `backend/services/careerAssistantService.js`
   - `backend/utils/careerAssistantPrompts.js`
4. Add models:
   - `backend/models/CareerAssistantConversation.js`
   - `backend/models/CareerAssistantReport.js`
5. Wire to `backend/server.js` under `/api/career-assistant`.
6. Add required dependencies (pdf/docx parsing) and confirm server starts.

### Step 2 — Frontend hub UI
1. Add route in `frontend/interview-prep-ai/src/App.jsx`.
2. Create hub page:
   - `frontend/interview-prep-ai/src/pages/CareerAssistant/CareerAssistantHub.jsx`
3. Add components:
   - Mode selector cards
   - Mode input forms
   - Result cards + progress bars
   - Timeline roadmap
   - HR interviewer step-by-step chat/evaluation UI
4. Add frontend service wrapper:
   - `frontend/interview-prep-ai/src/services/careerAssistantServices.js`
5. Update `frontend/interview-prep-ai/src/utils/apiPaths.js` with new endpoints (if used by app).

### Step 3 — Integration + production checks
1. Ensure all mode APIs are called correctly with auth.
2. Ensure resume upload supports PDF/DOCX and errors are handled.
3. Ensure HR interviewer persists conversation + returns evaluations.
4. Run frontend + backend dev servers and smoke test all modes.

## Progress
- [x] Confirm plan approval.
- [x] Create backend foundation (routes/controllers/models/services/prompts + wiring).
- [x] Install resume parsing dependencies (pdf-parse, mammoth).
- [x] Update frontend hub UI (route + page + components + services).
- [ ] Integration + smoke testing.



