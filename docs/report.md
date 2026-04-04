# Assessment 1.2 Report

## Use of Gen-AI

### Tool Used

**Claude Code** — Anthropic's CLI-based AI coding assistant, running directly in the terminal with full project file access.

### How It Was Used

Unlike the typical workflow of copying code from ChatGPT and pasting it into the project, Claude Code was integrated directly into the development environment. It could read existing code, write/edit files, run tests, and handle Git operations — all within one continuous session.

### Prompts and Tasks

| Phase | Prompt Examples | What AI Did |
|-------|----------------|-------------|
| Phase 2: Delivery CRUD | "Start Phase 2 based on TASKS.md, follow the rules in CLAUDE.md" | Created Delivery model, controller (5 CRUD methods with role-based access), routes, and 14 test cases |
| Phase 2: Frontend | "The frontend pages look too plain and cheap" → provided style.png as reference | Configured Tailwind dark theme, built DashboardLayout (sidebar + header), restyled Login/Register/Profile, created delivery pages |
| Phase 3: Route Management | "Create the Phase 3 branch and start building" | Created Route model, controller, routes, MapView (Leaflet), RouteList/RouteDetail pages, 15 test cases |
| Phase 4: Dashboards | "Start the Phase 4 development tasks" | Built three role-based dashboards (Customer/Dispatcher/Driver) with stats, cards, and search |
| Phase 5: Responsive | "Same approach as before" | Added hamburger menu for mobile, responsive card layouts, LoadingSpinner component |
| Phase 6: Docs | "Write the README.md first" | Generated README with project structure, API docs, and setup instructions |

### What Was Done Without AI

- Project planning (TASKS.md, CLAUDE.md)
- CI/CD pipeline configuration (GitHub Actions, EC2, PM2)
- All code review and approval before committing
- Key design decisions were made collaboratively through discussion

### How AI Output Was Verified

- **38 automated tests** run after each phase (Mocha/Chai/Sinon)
- **Frontend build** (`npm run build`) verified after every change
- **Developer review** of all code before committing — actively corrected issues (e.g., color scheme too dark, header layout disconnected)
