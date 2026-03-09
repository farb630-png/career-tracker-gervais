# Career Tracker — Product Requirements Document

**Version:** 1.0
**Date:** 2026-03-08
**Status:** Draft

---

## Overview

Career Tracker is a web app built on React + Vite + Supabase that helps users track their weekly job-search habits and progress. Users sign in with Google and their progress is synced across devices.

This PRD captures the next set of features to improve usability, accessibility, and content management.

---

## Features

### F-01 · Default Tab = Dashboard

**Priority:** High
**Effort:** XS (< 1 hour)

**Description:**
When a user opens the app or signs in, the active tab should default to the Dashboard tab instead of whatever was previously active.

**Acceptance Criteria:**
- On first load, the Dashboard tab is selected by default
- After sign-in, the Dashboard tab is selected
- The current-tab state is not persisted to localStorage or Supabase

---

### F-02 · Reset All Progress

**Priority:** High
**Effort:** S (1–2 hours)

**Description:**
Users need a way to wipe all their tracked data and start fresh (e.g. beginning a new job search cycle).

**Acceptance Criteria:**
- A "Reset Progress" button is accessible from Settings or a menu
- Clicking it shows a confirmation dialog: "This will permanently delete all your progress. This cannot be undone."
- On confirm: `week_data`, `habit_ratings`, and `current_week` are reset to their defaults in both state and Supabase
- On cancel: nothing changes
- After reset, the user remains signed in

---

### F-03 · Dynamic User Name in Header

**Priority:** High
**Effort:** S (1–2 hours)

**Description:**
The header currently shows a hardcoded name (or no name). It should display the signed-in user's name pulled from their Google profile.

**Acceptance Criteria:**
- The header displays the user's `full_name` from `session.user.user_metadata`
- Falls back to their email address if no full name is available
- Updates immediately after sign-in without requiring a page refresh

---

### F-04 · Dark Mode

**Priority:** Medium
**Effort:** M (3–5 hours)

**Description:**
Add a light/dark theme toggle. The app currently uses a light-only design system.

**Acceptance Criteria:**
- A toggle (e.g. sun/moon icon) is visible in the header or settings
- Toggling switches the app between light and dark color schemes
- The user's preference is persisted to localStorage
- The app respects `prefers-color-scheme` media query on first load
- All UI elements (cards, inputs, modals, nav) render correctly in both modes
- Dark mode color tokens are defined and consistent with the existing design system

---

### F-05 · Mobile Web UI Improvements

**Priority:** High
**Effort:** L (1–2 days)

**Description:**
The app is usable on desktop but poorly laid out on mobile. The layout, navigation, and tap targets need a full mobile-first pass.

**Acceptance Criteria:**
- Bottom tab navigation replaces or augments the top nav on screens < 768px
- All cards and inputs use full-width layouts on mobile
- Tap targets are a minimum of 44×44px
- Text is legible without zooming (no horizontal scroll)
- Charts/progress bars scale correctly on narrow viewports
- The header is compact and doesn't eat vertical space on mobile
- Tested on iOS Safari and Android Chrome

---

### F-06 · Admin Panel / Copy Editor

**Priority:** Medium
**Effort:** L (1–2 days)

**Description:**
The app's section titles, habit names, descriptions, and guidance copy are currently hardcoded. An admin panel allows the app owner to edit this copy without a code deploy.

**Acceptance Criteria:**
- Admin access is gated by a specific user email or a boolean flag in Supabase
- Admin panel is accessible via a hidden route (e.g. `/admin`) or a menu item only visible to admins
- Admin can edit: section titles, habit names, habit descriptions, week labels, and any guidance text
- Changes are saved to a `app_config` table in Supabase and applied globally for all users
- Non-admin users see only the live copy; they cannot access the admin panel
- Changes take effect without a redeploy

**Schema (suggested):**
```sql
create table app_config (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);
-- No RLS needed if only read by all, write restricted to admin role
```

---

### F-07 · Sign In with Apple

**Priority:** Medium
**Effort:** S (2–4 hours)

**Description:**
Add Apple as an OAuth provider alongside Google. Required for App Store distribution if a native app is ever built; also preferred by many iOS users on the web.

**Acceptance Criteria:**
- "Continue with Apple" button appears on the sign-in screen alongside Google
- Successful sign-in with Apple authenticates the user and syncs their data
- Apple sign-in is configured in Supabase (Auth → Providers → Apple) and in the Apple Developer portal
- Sign-in works on both desktop and iOS Safari

**Notes:**
- Requires an Apple Developer account ($99/year)
- Apple requires a `name` and `email` scope on first sign-in only; subsequent logins don't return these — handle gracefully

---

### F-08 · Email + Password Auth

**Priority:** Low
**Effort:** M (3–5 hours)

**Description:**
Allow users to create an account and sign in using an email address and password, in addition to Google/Apple OAuth.

**Acceptance Criteria:**
- Sign-up form: email, password, confirm password
- Sign-in form: email, password
- Supabase Email provider is enabled with email confirmation
- Validation: password minimum 8 characters; email format check
- Error messages are user-friendly (e.g. "Email already in use", "Invalid password")
- New email users are assigned a `user_progress` row on first sign-in (same seeding logic as OAuth)

---

### F-09 · Password Reset

**Priority:** Low
**Effort:** S (1–2 hours)
**Depends on:** F-08

**Description:**
Users who signed up with email/password need a way to reset a forgotten password.

**Acceptance Criteria:**
- "Forgot password?" link on the sign-in screen
- Clicking it shows a form to enter their email address
- Supabase sends a password-reset email using its built-in flow
- User lands on a reset page, enters a new password, and is signed in
- The reset page handles expired/invalid tokens gracefully with a clear error message

---

### F-10 · Profile Menu

**Priority:** High
**Effort:** S (2–3 hours)

**Description:**
Replace the standalone Reset and Sign Out buttons in the header with a unified Profile menu. Clicking the user's avatar (or a fallback icon) opens a dropdown that centralizes account actions and settings. This menu becomes the home for dark mode toggle, reset progress, sign out, and future settings.

**Acceptance Criteria:**
- Clicking the user avatar/icon in the header opens a dropdown menu
- Clicking outside the dropdown or pressing Escape closes it
- Menu items (initial):
  - User name + email (display only, top of menu)
  - Dark Mode toggle (placeholder until F-04 is built)
  - Reset Progress (opens the existing confirmation modal)
  - Sign Out
- The dropdown is styled consistently with the existing design system
- The Reset and Sign Out buttons currently in the header are removed in favor of the menu
- Menu is accessible: keyboard-navigable, proper ARIA roles

**Future items (not in scope for v1):**
- Notification preferences
- Data export
- Account deletion
- Language / locale settings

---

## Implementation Order (Suggested)

| # | Feature | Priority | Effort | Notes |
|---|---------|----------|--------|-------|
| 1 | F-01 Default Tab | High | XS | Quick win |
| 2 | F-03 User Name in Header | High | S | Quick win |
| 3 | F-02 Reset Progress | High | S | User safety — done |
| 4 | F-10 Profile Menu | High | S | Consolidates header actions |
| 5 | F-05 Mobile UI | High | L | Biggest UX impact |
| 6 | F-04 Dark Mode | Medium | M | Polish; toggle lives in F-10 menu |
| 7 | F-07 Sign In with Apple | Medium | S | Needs Apple dev account |
| 8 | F-06 Admin Panel | Medium | L | Content flexibility |
| 9 | F-08 Email + Password | Low | M | Broader reach |
| 10 | F-09 Password Reset | Low | S | Depends on F-08 |
