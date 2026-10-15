# Job Application Tracker

A clean, responsive web app to track job applications from wishlist to offer, so you always know where you applied, what stage each application is at, and when your next interview is.

**Live demo:** (https://job-application-tracker-sooty-delta.vercel.app/dashboard)

![Dashboard](docs/dashboard.png)

## Features

- **Dashboard** with summary cards (total, active, interviews, offers), a pure-CSS status chart, and the 5 most recent applications
- **Applications list** with search, status filter, and delete
- **Add / edit form** built with a single Reactive Form and validation, reused for both modes based on the route
- **Persistent data** saved in `localStorage`, so it survives refreshes
- **Fully responsive**: the table turns into cards on mobile
- **Lazy-loaded routes** to keep the initial bundle small

## Tech stack

- Angular (standalone components, signals, new control flow `@if` / `@for`)
- Reactive Forms
- SCSS with CSS custom properties for theming
- Unit tests with the Angular test runner

## Architecture

```
Component (UI)  <->  ApplicationsStore (signals)  <->  StorageService  <->  localStorage
```

- `ApplicationsStore` is the single source of truth. Data lives in one signal, and derived values (total, count per status) are `computed`, so nothing is duplicated or out of sync.
- Every change goes through one `commit()` method that updates the signal and persists to storage together.
- Persistence is isolated in `StorageService`, so swapping `localStorage` for a real API means changing a single file.

## Getting started

```bash
npm install
ng serve
```

Open http://localhost:4200.

### Run the tests

```bash
ng test --watch=false
```

### Production build

```bash
ng build
```

## Project structure

```
src/app
├── core
│   ├── layout/header
│   ├── models        # Application types and status list
│   └── store         # ApplicationsStore (signals)
└── features
    ├── dashboard
    └── applications  # list + form
```

## Roadmap

- Backend API with authentication
- Drag and drop between status columns (kanban view)
- Interview reminders and calendar export
- Export / import as CSV

## Author

Built by Bassant. (https://github.com/BassantEzzat)
