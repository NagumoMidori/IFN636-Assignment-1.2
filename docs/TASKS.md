# Delivery Route Planner — Task Breakdown

## Phase 1: Role-Based Authentication (branch: `feature/role-auth`)

### Backend
- [x] Add `role` field to User model (`customer`, `driver`, `dispatcher`) with default `customer`
- [x] Add `phone` field to User model
- [x] Update `registerUser` controller to accept and save `role` and `phone`
- [x] Update `loginUser` controller to return `role` in response
- [x] Update `getProfile` / `updateUserProfile` to include new fields
- [x] Create `authorise(...roles)` middleware — checks `req.user.role` against allowed roles
- [x] Add role-based test cases

### Frontend
- [x] Update Register page — add role dropdown (Customer / Driver / Dispatcher) and phone field
- [x] Update Login page — store role in AuthContext on login
- [x] Update AuthContext — include `role` in user state
- [x] Update Navbar — show different links based on role
- [x] Create `ProtectedRoute` wrapper that checks role before rendering

---

## Phase 2: Delivery CRUD (branch: `feature/delivery-crud`)

### Backend
- [ ] Create `Delivery` model:
  - `receiverName`, `receiverPhone`, `pickupAddress`, `packageType`
  - `status` (pending / delivered / cancelled), default `pending`
  - `customer` (ref → User), `driver` (ref → User, optional)
  - timestamps
- [ ] Create `deliveryController.js`:
  - `createDelivery` — Customer only
  - `getDeliveries` — Customer sees own, Dispatcher sees all, Driver sees assigned
  - `getDeliveryById` — with ownership/role check
  - `updateDelivery` — Customer updates own request; Dispatcher updates status/assigns driver
  - `deleteDelivery` — Dispatcher only
- [ ] Create `deliveryRoutes.js` — wire up CRUD endpoints under `/api/deliveries`
- [ ] Register delivery routes in `server.js`
- [ ] Add delivery test cases

### Frontend (desktop-first, dark dashboard style per `docs/style.png`)
- [ ] Configure Tailwind theme — dark color palette (deep navy sidebar/bg, card colors, accent blues/purples, status badge colors from Figma)
- [ ] Create sidebar layout component — left sidebar navigation + top bar (search, user avatar), reusable across all pages
- [ ] Restyle Phase 1 pages to dark dashboard style — Login, Register, Profile, Navbar
- [ ] Create `CreateDelivery` page (Customer) — form: receiver name, phone, pickup address, package type; dark card style
- [ ] Create `DeliveryList` component — card list with status badges (green Delivered / yellow Pending / red Cancelled), matching all Figma content
- [ ] Create `DeliveryDetail` page — full delivery info, driver info, status, package type; all Figma fields present
- [ ] Wire up API calls via `axiosConfig.jsx`

---

## Phase 3: Route Management (branch: `feature/route-management`)

### Backend
- [ ] Create `Route` model:
  - `routeId` (display ID like "Route-1532")
  - `driver` (ref → User)
  - `stops` (array of `{ address, city, completed }`)
  - `status` (active / completed), `transportType` (bike / car / train)
  - `distance`, `duration`
  - timestamps
- [ ] Create `routeController.js`:
  - `createRoute` — Dispatcher only
  - `getRoutes` — Dispatcher sees all, Driver sees assigned
  - `getRouteById`
  - `updateRoute` — Dispatcher: reassign driver, regenerate; Driver: mark stops complete
  - `deleteRoute` — Dispatcher only
- [ ] Create `routeRoutes.js` — wire up under `/api/routes`
- [ ] Register route routes in `server.js`
- [ ] Add route test cases

### Frontend (dark dashboard style, all Figma content required)
- [ ] Install `leaflet` + `react-leaflet` — map dependency for route visualization
- [ ] Create reusable `MapView` component — Leaflet map with stop markers (color-coded by completed/pending status), using OpenStreetMap tiles
- [ ] Create `RouteList` component — cards with route ID, date, status badge, driver info; dark card style
- [ ] Create `RouteDetail` page — embed MapView, route info, stops list, mark complete toggle, distance, duration; all Figma fields present
  - Dispatcher view: Reassign Driver form (driver selection list), Regenerate Route action (transport type selection: Bike/Car/Train)
  - Driver view: mark stops as complete, progress indicator (x/total completed), next stop highlight (city, distance, time), Navigate button
  - Customer view: read-only route/delivery info, driver info, package type, weight, distance

---

## Phase 4: Role-Based Dashboards (branch: `feature/dashboards`)

### Customer Dashboard (dark dashboard style, all Figma content required)
- [ ] Greeting header with user name
- [ ] Current/latest delivery highlight card (full delivery info as per Figma)
- [ ] "Create Delivery" button → links to CreateDelivery page
- [ ] Delivery history list with status badges

### Dispatcher/Admin Dashboard (dark dashboard style, all Figma content required)
- [ ] Greeting header with user name
- [ ] Stats cards: Completed Deliveries count, Active Routes count
- [ ] Search bar to filter deliveries
- [ ] "All Deliveries" list — delivery/route cards with ID, date, status badge, driver info

### Driver Dashboard (dark dashboard style, all Figma content required)
- [ ] Greeting header with user name
- [ ] Current route card (route ID, stop count, driver info)
- [ ] "Next Stop" highlight card (city name, distance, time)
- [ ] Stats: completed / pending counts
- [ ] Recent deliveries list

### Shared
- [ ] Update `App.js` routing — role-based dashboard redirect after login
- [ ] Update Profile page — show role badge, phone, total routes managed; dark card style

---

## Phase 5: Responsive Styling (branch: `feature/responsive-ui`)

- [ ] Responsive sidebar: collapse to hamburger menu or bottom nav on mobile
- [ ] Responsive layouts: single column on mobile (reference Figma mobile designs), multi-column grid on desktop
- [ ] Fine-tune spacing, typography, and card layouts for mobile viewports
- [ ] Test on mobile viewport sizes (375px, 390px) and desktop (1024px+)
- [ ] Polish: consistent hover states, transitions, loading states

---

## Phase 6: DevOps & Documentation (branch: `feature/devops`)

- [ ] Update GitHub Actions CI/CD workflow (`ci.yml`) to run tests
- [ ] Configure EC2 deployment with PM2
- [ ] Set up environment variables on EC2
- [ ] Write `README.md` — project overview, setup instructions, API endpoints, screenshots
- [ ] Complete Assessment 1.2 submission template (report, Gen-AI disclosure, reflection)

---

## Suggested Build Order

1. **Phase 1** first — everything depends on role-based auth
2. **Phase 2** next — core CRUD, highest marks (backend 5pts)
3. **Phase 3** after deliveries work — extends the same patterns
4. **Phase 4** ties it together — role-specific views
5. **Phase 5** polish — responsive styling pass
6. **Phase 6** last — deployment and documentation

## Execution Rules

- Work on one task at a time
- Do not jump across phases
- Complete backend before frontend for each feature
- Always explain changes before implementation
