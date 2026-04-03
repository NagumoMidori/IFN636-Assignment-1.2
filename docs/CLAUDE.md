# Delivery Route Planner - Project Instructions

## Project Overview

This is a university assessment project (IFN636 - Software Life Cycle Management) for building a **Delivery Route Planner** system. The project spans two assessments:

- **Assessment 1.1** (completed): Design & planning phase — SysML diagrams, Figma UI/UX mockups, JIRA project management. Artifacts are in `delivery-route-planner/`.
- **Assessment 1.2** (current): Full-stack CRUD implementation with DevOps. Starter code is in `assign-1.2/sampleapp_IFQ636/`.

## System Description

A role-based delivery management web application with **three user roles**:

| Role | Key Capabilities |
|------|-----------------|
| **Customer** | Create delivery requests, view delivery status/details, track deliveries |
| **Driver** | View assigned routes, navigate stops, mark deliveries as complete |
| **Dispatcher/Admin** | View all deliveries, assign drivers, generate/regenerate routes, manage drivers, view system reports |

### Domain Entities (from BDD)
- **Customer** -> creates **Delivery Request** -> has **Delivery Status**
- **Dispatcher** -> manages **Driver**(s) (0..n)
- **Driver** -> assigned to **Route** -> contains **Location**(s) (1..n)
- **Route Planner** generates routes

## Tech Stack

- **Backend**: Node.js, Express 4.17, MongoDB (Mongoose 6), JWT (jsonwebtoken), bcrypt
- **Frontend**: React 18.2, React Router 6, Axios, Tailwind CSS 3.4
- **DevOps**: GitHub Actions CI/CD, AWS EC2, PM2
- **Testing**: Mocha, Chai, chai-http, Sinon

## Project Structure

```
software-life-cycle/
├── delivery-route-planner/       # Assessment 1.1 artifacts (READ-ONLY reference)
│   ├── report.md                 # Full design report
│   ├── figma/                    # UI/UX mockups (mobile-first designs)
│   │   ├── admin/                # Dispatcher/Admin screens
│   │   ├── customer/             # Customer screens
│   │   └── driver/               # Driver screens
│   ├── Jira/                     # Project management screenshots
│   ├── *.png                     # SysML diagrams (use-case, requirements, BDD)
│   └── marking/                  # Assessment rubric
├── assign-1.2/                   # Assessment 1.2 (ACTIVE DEVELOPMENT)
│   ├── Assessment 1.2 - Submission Template v2.md
│   └── sampleapp_IFQ636/        # Starter project (main codebase)
│       ├── backend/
│       │   ├── server.js         # Express app entry point (port 5001)
│       │   ├── config/db.js      # MongoDB connection
│       │   ├── models/User.js    # User schema (name, email, password, university, address)
│       │   ├── controllers/authController.js  # Auth logic (register, login, profile)
│       │   ├── middleware/authMiddleware.js    # JWT protect middleware
│       │   └── routes/authRoutes.js           # Auth routes
│       ├── frontend/
│       │   ├── src/
│       │   │   ├── App.js              # Router: /login, /register, /profile, /tasks
│       │   │   ├── axiosConfig.jsx     # Axios base URL config (localhost:5001)
│       │   │   ├── context/AuthContext.js  # Auth state management
│       │   │   ├── components/         # Navbar, TaskForm, TaskList
│       │   │   └── pages/              # Login, Register, Profile, Tasks
│       │   └── tailwind.config.js
│       └── .github/workflows/ci.yml   # GitHub Actions pipeline
└── CLAUDE.md                     # This file
```

## Key Files (READ THESE FIRST)

### Backend
- `backend/server.js` — Express app entry point
- `backend/config/db.js` — MongoDB connection
- `backend/models/User.js` — user schema
- `backend/controllers/authController.js` — authentication logic
- `backend/middleware/authMiddleware.js` — JWT protection middleware
- `backend/routes/authRoutes.js` — authentication routes

### Frontend
- `frontend/src/App.js` — main router
- `frontend/src/axiosConfig.jsx` — centralized API config
- `frontend/src/context/AuthContext.js` — authentication state
- `frontend/src/pages/Login.jsx` — login page
- `frontend/src/pages/Register.jsx` — register page
- `frontend/src/pages/Profile.jsx` — profile page

### Notes
- Read these files first before exploring the rest of the project.
- Prefer making focused changes in existing files before creating new ones.

## Design Reference (Figma Mockups)

The Figma designs are **mobile app mockups** but we are building a **responsive web application**. The web app should:
- Follow the visual language and color scheme from Figma (purple/violet primary, green accents, clean card-based layout)
- Be fully responsive — work well on both desktop and mobile browsers
- Adapt the mobile layouts for larger screens (e.g., side-by-side panels, wider cards, grid layouts on desktop)
- Maintain the same UX flows and information hierarchy from the Figma designs

### Key Figma Design Details

**Color Palette:**
- Primary: Purple/violet gradient (#6C3CE1 to #8B5CF6 range)
- Secondary: Green (#10B981 range) for navigation/action icons
- Accent: Pink/light purple for highlights
- Cards: White with subtle shadows
- Status badges: Green (Delivered), Yellow/Orange (Pending), Red (Cancelled)

**Common Pages (all roles):**
- **Onboarding**: Splash screen with illustration, "Plan your deliveries anytime, anywhere"
- **Login**: Email + password fields; role selector dropdown (Customer / Driver / Dispatcher/Admin)
- **Register**: Full name, email, password, role selection; Terms & Privacy Policy checkbox
- **Profile**: Avatar, name, role badge, email, phone number, total routes managed; Edit Profile modal

**Dispatcher/Admin Pages:**
- **Dashboard**: Greeting header, search bar, stats cards (Completed Deliveries count, Active Routes count), "All Deliveries" list with route cards showing route ID, date, and status badge (Delivered/Pending/Cancelled)
- **Route Details**: Map view, route info (ID, driver name, total stops, pending, completed, distance, duration), "Marked as Complete" toggle, Reassign Driver button, Regenerate Route button
- **Reassign & Regenerate**: Driver selection list, transport type selection (Bike/Car/Train), Reassign Driver and Regenerate Route buttons

**Customer Pages:**
- **Dashboard**: Greeting header, current delivery highlight card, "Create Delivery" button, History list of past deliveries with status
- **Route Details**: Map with route visualization, driver info, package type, weight, distance, created time
- **Create Delivery**: Form with receiver name, receiver phone, pickup address, package type, "Place Order" button

**Driver Pages:**
- **Dashboard**: Greeting header, current route card (Route ID, stop count), "Next Stop" highlight (city name), stats (completed/pending counts), "Recent Deliveries" list
- **Route Details**: Map with route stops, next stop info (distance, city, time), address details, phone, "Marked as Complete" toggle, Navigate button, completion progress indicator

**Bottom Navigation (all roles):** Home icon, Map/Location icon, Profile icon

## Assessment 1.2 Marking Criteria (20 marks total)

| Category | Marks | Key Requirements |
|----------|-------|-----------------|
| Backend Development | 5 | Node.js + Express + MongoDB CRUD operations, proper API design |
| Frontend Development | 3 | React.js UI matching design, responsive layout |
| Authentication & Authorisation | 3 | JWT auth, role-based access control, protected routes |
| GitHub Version Control | 3 | Branching strategy, feature branches, pull requests, clean commits |
| CI/CD Pipeline | 3 | GitHub Actions workflow, automated testing, EC2 deployment |
| README.md and Report | 3 | Documentation, discussion, Gen-AI disclosure, reflection |

## Development Guidelines

### What Needs to Be Built (extending the starter template)

1. **Role-based User System**: Extend User model with a `role` field (customer/driver/dispatcher). Login should include role selection. Registration should include role selection.

2. **Delivery Management (CRUD)**:
   - **Model**: Delivery/DeliveryRequest with fields like receiverName, receiverPhone, pickupAddress, packageType, status (pending/delivered/cancelled), customer reference, driver reference
   - **Customer**: Create, Read (own deliveries), Update (own requests)
   - **Dispatcher**: Read all, Update status, Assign driver, Delete
   - **Driver**: Read (assigned), Update status (mark complete)

3. **Route Management (CRUD)**:
   - **Model**: Route with fields like routeId, driver reference, stops/locations, status, distance, duration, transportType
   - **Dispatcher**: Create, Read all, Update (reassign driver, regenerate), Delete
   - **Driver**: Read (assigned routes), Update (mark stops complete)

4. **Role-Based Authorization**: Middleware to restrict endpoints by role. Different dashboard views per role.

5. **Responsive Frontend**: Translate Figma mobile designs into responsive React pages that work on all screen sizes.

### Coding Conventions

- Backend follows MVC pattern: models/, controllers/, routes/, middleware/
- Use async/await for all async operations
- Frontend uses functional components with hooks
- State management via React Context (AuthContext pattern)
- Styling with Tailwind CSS utility classes
- API calls through centralized axios instance (axiosConfig.jsx)

### Coding Rules (STRICT)

- MUST follow MVC structure (models/, controllers/, routes/, middleware/)
- DO NOT put business logic inside routes

- MUST use async/await for all async operations
- DO NOT use callbacks or .then()

- Frontend MUST use functional components with hooks
- MUST use React Context for authentication state (AuthContext pattern)
- DO NOT introduce Redux or other state management libraries

- All API calls MUST go through axiosConfig.jsx
- DO NOT call axios directly

- MUST follow existing project code style and file structure

### Constraints (VERY IMPORTANT)

- DO NOT introduce new frameworks or libraries unless necessary
- DO NOT over-engineer solutions

- DO NOT rename existing files or project structure without reason

- When modifying core parts (e.g., authentication, database schema), 
  explain the changes before implementing

- DO NOT make large refactors without explanation

- Always follow the existing project structure and conventions

### Working Style

- Always read relevant files before making changes

- Explain what you are going to do before writing code
- Keep explanations short and clear

- Make small, focused changes instead of large rewrites
- Prefer modifying existing files over creating new ones

- When unsure, ask for clarification instead of guessing

- Prefer simple and maintainable solutions
- Avoid unnecessary complexity

- After implementing, briefly explain what was changed and why

### Git & Branching Strategy

- Use feature branches (e.g., `feature/delivery-crud`, `feature/role-auth`, `feature/driver-dashboard`)
- Create pull requests for merging into main
- Write meaningful commit messages
- Keep commits atomic and focused

### CI/CD

- GitHub Actions workflow in `.github/workflows/ci.yml`
- Pipeline should run tests on push/PR to main
- Deployment target: AWS EC2 instance with PM2

### Environment Variables

Backend requires (see `backend/.env.example`):
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT signing
- `PORT` - Server port (default 5001)

## Important Notes

- The starter project has Task-related components (TaskForm, TaskList, Tasks page) as placeholder CRUD examples. These should be replaced/adapted with delivery-route-planner domain entities.
- The task routes are commented out in `server.js` — no Task model or controller exists yet. This is intentional scaffolding.
- The Figma designs show a bottom navigation bar (mobile pattern). For the responsive web version, use a top navbar on desktop and optionally a bottom nav on mobile, or a responsive top navbar that works on both.
- Gen-AI usage must be documented in the final report — keep track of how Claude is used during development.

## Efficiency Guidelines

- Prefer reading only relevant files instead of scanning the entire project

- Do not explore the full project unless absolutely necessary

- Focus on the task and avoid unnecessary analysis

- Reuse existing code and patterns instead of creating new ones

- Keep responses concise and avoid overly long explanations

- When multiple approaches are possible, choose the simplest one
