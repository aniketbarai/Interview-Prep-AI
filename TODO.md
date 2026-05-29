# TODO: UI responsive fixes

## Information gathered
- Project uses Tailwind via `@import "tailwindcss"` and a custom CSS layer in `frontend/interview-prep-ai/src/index.css`.
- Navbar + layout already include mobile-first patterns (`md:flex`, `mobileMenuOpen`, responsive paddings).
- Pages like `LandingPage`, `Dashboard`, and `CreateSessionForm` look largely responsive using Tailwind breakpoints.
- `Login.jsx` is a fixed-width modal content wrapper (`w-[min(92vw,460px)]`), likely OK but can be improved for very small screens.
- A `search_files` tool failed due to missing `ripgrep` binary, so targeted file inspection was done via `read_file`.

## Plan (file-level)
1. **Add robust, app-wide responsive safety CSS** in `frontend/interview-prep-ai/src/index.css`:
   - prevent layout shifts from fixed elements on small screens
   - add `max-width` handling for viewport
   - ensure input/button/tap sizes
   - fix potential overscroll / scrolling issues
2. **Improve Login layout for smaller devices** (`frontend/interview-prep-ai/src/pages/Auth/Login.jsx`):
   - ensure vertical fit (max-height + scroll)
   - improve spacing on very small screens
3. **Validate & adjust any non-responsive fixed measurements** in the inspected components (DashboardLayout/Navbar already OK; do only if issues found).

## Progress
- Done: Added responsive safety defaults to `index.css`.
- Done: Improved `Login.jsx` to scroll within viewport on short screens.


## Followup steps
- Run frontend lint/build (or `npm run dev`) to ensure no Tailwind class typos.
- Manually verify breakpoints: 320px, 375px, 768px, 1024px.

