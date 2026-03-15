# 🏫 Campus Resource Management System (CRMS)

CRMS is a role-based web application for booking campus resources (rooms, labs, etc.) with a **2-step approval workflow (Staff → Admin)** for student bookings and a **direct Admin workflow** for staff bookings.

---

## 📝 Project Overview

- Centralized booking of campus resources with clear visibility of approvals and history.
- Separate portals and permissions for **Students**, **Staff**, and **Admins**.
- 2-stage approval pipeline for student bookings (Staff → Admin) and direct Admin approval for staff bookings.
- Policy-driven limits for daily/monthly bookings and hours to prevent abuse.

---

## 🏗️ System Architecture

- **Frontend**: React 18 + Vite SPA communicating with the backend via Axios.
- **Backend**: Spring Boot REST API secured with JWT (Spring Security).
- **Database**: MySQL 8+ using Spring Data JPA + Hibernate with UUID-based entities.
- **Auth Flow**: Frontend stores JWT in localStorage; every API call attaches `Authorization: Bearer <token>`.

```text
[Browser (Student / Staff / Admin)]
          ↓
   [React + Vite SPA]
          ↓ (Axios + JWT)
 [Spring Boot REST API]
          ↓
        [MySQL]
```

---

## 🧰 Tech Stack

**Backend**
- Spring Boot 4 (Java 21)
- Spring Security (JWT)
- Spring Data JPA + Hibernate
- MySQL
- MapStruct + Lombok

**Frontend**
- React 18 + Vite
- React Router
- Axios

---

## 🗂️ Table of Contents

- [Project Overview](#project-overview)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Roles & Capabilities](#roles--capabilities)
- [Workflow](#workflow)
- [Setup Instructions](#setup-instructions)
- [Frontend Routes](#frontend-routes)
- [API Overview](#api-overview)
- [Database Structure](#database-structure)
- [Screenshots](#screenshots)
- [Notes](#notes)
- [Push to GitHub](#push-to-github)

---

## 🧱 Project Structure

```
campus-resource-management/
├── README.md
├── backend/                                    # Spring Boot Backend
│   ├── pom.xml                                 # Maven configuration
│   ├── mvnw, mvnw.cmd                          # Maven wrapper
│   └── src/
│       ├── main/
│       │   ├── java/com/campus/
│       │   │   ├── CampusApplication.java      # Main entry point
│       │   │   ├── config/                     # CORS + JPA/Hibernate config
│       │   │   ├── controller/                 # REST controllers
│       │   │   ├── dto/                        # Request/Response DTOs
│       │   │   ├── entity/                     # JPA Entities
│       │   │   ├── enums/                      # Role, approval stages, etc.
│       │   │   ├── exception/                  # Global exception handling
│       │   │   ├── mapper/                     # MapStruct mappers
│       │   │   ├── repository/                 # Spring Data JPA repositories
│       │   │   ├── security/                   # JWT + Spring Security
│       │   │   ├── service/                    # Services (+ impl/)
│       │   │   └── util/                       # Helpers (security/date/enrichment)
│       │   └── resources/
│       │       └── application.properties      # App configuration
│       └── test/                               # Unit tests
│
└── frontend/                                   # React Frontend
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
    ├── api/                                # Axios API wrappers
    ├── components/                         # UI components
    ├── context/                            # Auth context
    ├── pages/                              # Route pages
    ├── routes/                             # Routing + auth guard
    ├── styles/                             # Global + component styles
    └── utils/                              # Helpers
```

---

## ✨ Features

- 🔐 Role-based JWT authentication with separate portals for Student, Staff, and Admin.
- ✅ 2-stage approval pipeline for student bookings (Staff → Admin) and direct Admin approval for staff bookings.
- 🕒 Hourly slot booking with operating rules (working hours, lunch break, no past slots).
- 🧑‍🏫 Advisor-based staff approvals and student management.
- 📊 Staff statistics plus admin management for resources, users, and bookings.
- 📏 Policy-based limits (per day/month bookings and hours) with support for unlimited roles.

---

## 👥 Roles & Capabilities

### 🎓 Student

- Register/Login (advisor selection required at registration)
- Browse resources and create booking requests
- View “My Bookings” with point-to-point approval progress and booking details
- See remaining policy limits (daily/monthly bookings and hours)

### 🧑‍🏫 Staff

- Approve/Reject student booking requests assigned to them (advisor-based)
- View student bookings + booking statistics (Total / Pending / Approved / Rejected)
- Create staff bookings (go directly to Admin)
- Student management: view assigned students and active/inactive counts

### 🛡️ Admin

- Approve/Reject bookings pending admin stage
- Manage resources (create/update/status change)
- Manage users (list/update/soft delete)
- View all bookings

---

## 🔄 Workflow

### 🔐 Authentication (JWT)

- Frontend stores JWT token + user in localStorage.
- Axios attaches `Authorization: Bearer <token>` automatically.

### ✅ Booking Approval Flow

Approval stages are defined in the backend enum `ApprovalStage`:
- `PENDING_STAFF`
- `PENDING_ADMIN`
- `APPROVED`
- `APPROVED_STAFF_ONLY`
- `REJECTED`
- `CANCELLED`

**Student booking**
1. Student creates a booking → `PENDING_STAFF`
2. Assigned Staff approves → moves to `PENDING_ADMIN`
3. Admin approves → `APPROVED` and visibility becomes `PUBLIC`
4. Staff/Admin can reject at their stage → `REJECTED`

**Staff booking**
1. Staff creates a booking → `PENDING_ADMIN` (skips staff review)
2. Admin approves → `APPROVED_STAFF_ONLY` and visibility becomes `STAFF_ONLY`
3. Admin can reject at admin stage → `REJECTED`

### 🕒 Availability / Slot Rules

Slots are hourly and generated using operating rules:
- Operating hours: 9:00 AM to 4:00 PM
- Lunch break blocked: 12:30 PM to 1:30 PM
- Duration must be full hours only
- Past dates and past slots (for today) are not allowed
- A resource/time conflict exists if an overlapping booking exists and stage is NOT `REJECTED`/`CANCELLED`

### 📏 Booking Policy Limits

Policies are stored per-role (`booking_policy`). If `isUnlimited=true`, limits are ignored.
Otherwise, validations enforce:
- max bookings/day, bookings/month
- max hours/day, hours/month

---

## 🚀 Setup Instructions

### ✅ Prerequisites

- Java 21
- Node.js 18+ (recommended)
- MySQL 8+

### 🧩 Backend (Spring Boot)

1. Create a MySQL database: `campus_db`
2. Update DB credentials in `backend/src/main/resources/application.properties` if needed.
3. Run:
    - Windows: `cd backend` then `./mvnw.cmd spring-boot:run`
4. Backend runs on: `http://localhost:8081`

### 🎨 Frontend (React)

1. `cd frontend`
2. `npm install`
3. Optional: set API base URL in environment:
    - Create `frontend/.env` and add: `VITE_API_BASE_URL=http://localhost:8081`
4. Run: `npm run dev`
5. Frontend runs on: `http://localhost:5173`

---

## 🧭 Frontend Routes

- `/` portal selection (redirects based on role)
- `/login/:portal` and `/register/:portal`
- `/forgot-password`

**Admin**
- `/admin` dashboard
- `/admin/resources`
- `/admin/users`

**Staff**
- `/staff` dashboard (approvals + student bookings + create booking)
- `/staff/approvals`
- `/staff/students`
- `/staff/bookings`

**Student**
- `/student` dashboard
- `/student/bookings`

---

## 🌐 API Overview

Base URL (backend): `http://localhost:8081`

<details>
    <summary><strong>Auth</strong></summary>

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/advisors`
- `POST /api/auth/forgot-password/send-otp`
- `POST /api/auth/forgot-password/verify-otp`
- `POST /api/auth/forgot-password/reset-password`
</details>

<details>
    <summary><strong>Bookings</strong></summary>

- `POST /api/bookings` (STUDENT/STAFF/ADMIN)
- `GET /api/bookings/my`
- `GET /api/bookings/all` (ADMIN)
- `GET /api/bookings/slots/{resourceId}?date=YYYY-MM-DD`
</details>

<details>
    <summary><strong>Approvals</strong></summary>

- `GET /api/approvals/staff/pending` (STAFF)
- `PUT /api/approvals/staff/{bookingId}` (STAFF approve)
- `PUT /api/approvals/staff/{bookingId}/reject` (STAFF reject)
- `GET /api/approvals/staff/student-bookings` (STAFF)
- `GET /api/approvals/staff/stats` (STAFF)

- `GET /api/approvals/admin/pending` (ADMIN)
- `PUT /api/approvals/admin/{bookingId}` (ADMIN approve)
- `PUT /api/approvals/admin/{bookingId}/reject` (ADMIN reject)
</details>

<details>
    <summary><strong>Resources (Full CRUD)</strong></summary>

- `GET /api/resources` (authenticated)
- `GET /api/resources/{id}` (authenticated)
- `POST /api/resources` (ADMIN)
- `PUT /api/resources/{id}` (ADMIN)
- `PATCH /api/resources/{id}/status` (ADMIN)
- `DELETE /api/resources/{id}` (ADMIN)
</details>

<details>
    <summary><strong>Users</strong></summary>

- `GET /api/users` (ADMIN)
- `PUT /api/users/{id}` (ADMIN)
- `DELETE /api/users/{id}` (ADMIN soft delete)
- `GET /api/users/my-students` (STAFF)
- `GET /api/users/my-students/stats` (STAFF)
</details>

<details>
    <summary><strong>Policy</strong></summary>

- `GET /api/policy/remaining`
</details>

---

## 🗄️ Database Structure

The system uses UUIDs stored as `CHAR(36)` in MySQL.

<details>
    <summary><strong>Schema (tables + key fields)</strong></summary>

### `users`
- `id` (UUID)
- `name`, `email` (unique), `phone`, `password` (BCrypt)
- `role` (`STUDENT` | `STAFF` | `ADMIN`)
- `advisor_id` (UUID, for students)
- `status` (`ACTIVE` | `INACTIVE`)
- `created_at`, `updated_at`

### `resources`
- `id` (UUID)
- `name`, `type`, `capacity`
- `status` (`AVAILABLE` | `MAINTENANCE` | `INACTIVE`)
- `created_at`, `updated_at`

### `bookings`
- `id` (UUID)
- `user_id` (UUID)
- `resource_id` (UUID)
- `booking_date`, `start_time`, `end_time`, `duration_hours`
- `approval_stage` (see workflow above)
- `visibility` (`PUBLIC` | `STAFF_ONLY` | `PRIVATE`)
- `staff_approved_by`, `staff_approved_at`
- `admin_approved_by`, `admin_approved_at`
- `created_at`, `updated_at`

### `booking_status_history`
- `id` (UUID)
- `booking_id` (UUID)
- `stage`
- `changed_at`
- `changed_by` (UUID)

### `booking_policy`
- `role` (primary key)
- limits per day/month (bookings + hours)
- `is_unlimited`

### `otp_tokens`
- `id` (UUID)
- `phone`, `otp`
- `verified`
- `expires_at`, `created_at`

</details>

---

## 🖼️ Screenshots

_Add screenshots of the Student, Staff, and Admin dashboards here once available (for example: login page, booking form, approval views, and admin management screens)._ 

---

## 📝 Notes

- OTP reset currently logs OTP to backend console (SMS gateway is TODO).
- Booking responses include both IDs and display names (`userName`, `resourceName`) to avoid showing UUIDs on UI.

---

## 📤 Push to GitHub

From the project root:

1. Initialize git (if not already): `git init`
2. Add a root `.gitignore` (recommended) to exclude `node_modules/`, `frontend/dist/`, and `backend/target/`.
3. Commit:
   - `git add .`
   - `git commit -m "Initial commit"`
4. Add remote and push:
   - `git remote add origin https://github.com/<your-username>/<repo-name>.git`
   - `git branch -M main`
   - `git push -u origin main`
