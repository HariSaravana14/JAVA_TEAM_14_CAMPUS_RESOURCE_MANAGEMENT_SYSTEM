# JAVA_TEAM_14_CAMPUS_RESOURCE_MANAGEMENT_SYSTEM

Campus Resource Management System (CRMS) is a role-based web application for booking campus resources (rooms/labs/etc.) with a 2-step approval workflow (Staff → Admin) for student bookings and a direct Admin workflow for staff bookings.

## Tech Stack

### Backend
- Spring Boot 4 (Java 21)
- Spring Security (JWT)
- Spring Data JPA + Hibernate
- MySQL
- MapStruct + Lombok

### Frontend
- React 18 + Vite
- React Router
- Axios

## Project Structure

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
│       │   │   ├── config/
│       │   │   │   ├── CorsConfig.java         # CORS configuration
│       │   │   │   └── JpaConfig.java          # JPA/Hibernate config
│       │   │   ├── controller/
│       │   │   │   ├── ApprovalController.java # Booking approvals (Staff/Admin)
│       │   │   │   ├── AuthController.java     # Login, Register, Password reset
│       │   │   │   ├── BookingController.java  # Create/view bookings
│       │   │   │   ├── PolicyController.java   # Booking policy limits
│       │   │   │   ├── ResourceController.java # Resource CRUD
│       │   │   │   └── UserController.java     # User management
│       │   │   ├── dto/
│       │   │   │   ├── request/                # Request DTOs
│       │   │   │   │   ├── CreateBookingRequest.java
│       │   │   │   │   ├── CreateResourceRequest.java
│       │   │   │   │   ├── LoginRequest.java
│       │   │   │   │   ├── RegisterRequest.java
│       │   │   │   │   ├── UpdateResourceRequest.java
│       │   │   │   │   ├── UpdateUserRequest.java
│       │   │   │   │   └── ...
│       │   │   │   └── response/               # Response DTOs
│       │   │   │       ├── AuthResponse.java
│       │   │   │       ├── BookingResponse.java
│       │   │   │       ├── BookingStatsResponse.java
│       │   │   │       ├── ResourceResponse.java
│       │   │   │       ├── UserResponse.java
│       │   │   │       └── ...
│       │   │   ├── entity/                     # JPA Entities
│       │   │   │   ├── Booking.java
│       │   │   │   ├── BookingPolicy.java
│       │   │   │   ├── BookingStatusHistory.java
│       │   │   │   ├── OtpToken.java
│       │   │   │   ├── Resource.java
│       │   │   │   └── User.java
│       │   │   ├── enums/
│       │   │   │   ├── ApprovalStage.java      # PENDING_STAFF, PENDING_ADMIN, etc.
│       │   │   │   ├── ResourceStatus.java     # AVAILABLE, MAINTENANCE, INACTIVE
│       │   │   │   ├── Role.java               # STUDENT, STAFF, ADMIN
│       │   │   │   ├── UserStatus.java         # ACTIVE, INACTIVE
│       │   │   │   └── VisibilityType.java     # PUBLIC, STAFF_ONLY, PRIVATE
│       │   │   ├── exception/
│       │   │   │   ├── GlobalExceptionHandler.java
│       │   │   │   ├── ConflictException.java
│       │   │   │   ├── ResourceNotFoundException.java
│       │   │   │   └── BookingLimitExceededException.java
│       │   │   ├── mapper/                     # MapStruct mappers
│       │   │   │   ├── BookingMapper.java
│       │   │   │   ├── ResourceMapper.java
│       │   │   │   └── UserMapper.java
│       │   │   ├── repository/                 # Spring Data JPA repositories
│       │   │   │   ├── BookingRepository.java
│       │   │   │   ├── BookingPolicyRepository.java
│       │   │   │   ├── ResourceRepository.java
│       │   │   │   ├── UserRepository.java
│       │   │   │   └── ...
│       │   │   ├── security/
│       │   │   │   ├── SecurityConfig.java     # Spring Security config
│       │   │   │   ├── JwtTokenProvider.java   # JWT generation/validation
│       │   │   │   ├── JwtAuthenticationFilter.java
│       │   │   │   ├── CustomUserDetailsService.java
│       │   │   │   └── UserPrincipal.java
│       │   │   ├── service/
│       │   │   │   ├── ApprovalService.java
│       │   │   │   ├── AuthService.java
│       │   │   │   ├── BookingService.java
│       │   │   │   ├── PolicyService.java
│       │   │   │   ├── ResourceService.java
│       │   │   │   ├── SlotService.java
│       │   │   │   ├── UserService.java
│       │   │   │   ├── ValidationService.java
│       │   │   │   └── impl/                   # Service implementations
│       │   │   │       ├── ApprovalServiceImpl.java
│       │   │   │       ├── AuthServiceImpl.java
│       │   │   │       ├── BookingServiceImpl.java
│       │   │   │       ├── PolicyServiceImpl.java
│       │   │   │       ├── ResourceServiceImpl.java
│       │   │   │       ├── SlotServiceImpl.java
│       │   │   │       ├── UserServiceImpl.java
│       │   │   │       └── ValidationServiceImpl.java
│       │   │   └── util/
│       │   │       ├── BookingResponseEnricher.java  # Adds userName/resourceName
│       │   │       ├── DateUtil.java
│       │   │       └── SecurityUtil.java
│       │   └── resources/
│       │       └── application.properties      # App configuration
│       └── test/                               # Unit tests
│
└── frontend/                                   # React Frontend
    ├── package.json                            # NPM dependencies
    ├── vite.config.js                          # Vite configuration
    ├── index.html                              # Entry HTML
    └── src/
        ├── main.jsx                            # React entry point
        ├── App.jsx                             # Root component
        ├── api/                                # Axios API calls
        │   ├── axiosInstance.js                # Axios config with JWT interceptor
        │   ├── authApi.js                      # Auth endpoints
        │   ├── bookingApi.js                   # Booking endpoints
        │   ├── policyApi.js                    # Policy endpoints
        │   ├── resourceApi.js                  # Resource endpoints
        │   └── userApi.js                      # User endpoints
        ├── components/
        │   ├── booking/
        │   │   ├── ApprovalStatusTracker.jsx   # Visual approval progress
        │   │   ├── BookingDetailsCard.jsx      # Booking detail view
        │   │   ├── BookingForm.jsx             # Create booking form
        │   │   └── BookingTable.jsx            # Bookings list table
        │   ├── layout/
        │   │   ├── Navbar.jsx                  # Top nav with session timer
        │   │   └── Sidebar.jsx                 # Role-based sidebar
        │   └── resource/
        │       └── ResourceCard.jsx            # Resource display card
        ├── context/
        │   └── AuthContext.jsx                 # Auth state + auto-logout
        ├── hooks/
        │   └── useAuth.js                      # Auth hook
        ├── pages/
        │   ├── admin/
        │   │   ├── AdminDashboard.jsx          # Admin home
        │   │   ├── ResourceManagement.jsx      # Resource CRUD
        │   │   └── UserManagement.jsx          # User management (read-only + status toggle)
        │   ├── auth/
        │   │   ├── ForgotPassword.jsx          # Password reset flow
        │   │   ├── Login.jsx                   # Login page
        │   │   ├── PortalSelect.jsx            # Role portal selection
        │   │   └── Register.jsx                # Registration page
        │   ├── staff/
        │   │   ├── MyStudents.jsx              # Assigned students list
        │   │   ├── PendingApprovals.jsx        # Pending booking approvals
        │   │   ├── StaffBookings.jsx           # Student bookings view
        │   │   └── StaffDashboard.jsx          # Staff home
        │   └── student/
        │       ├── MyBookings.jsx              # Student's bookings
        │       └── StudentDashboard.jsx        # Student home + booking form
        ├── routes/
        │   ├── AppRoutes.jsx                   # Route definitions
        │   └── ProtectedRoute.jsx              # Auth guard
        ├── styles/
        │   └── global.css                      # Global styles
        └── utils/
            └── dateUtils.js                    # Date formatting helpers
```

## Roles & Features

### Student
- Register/Login (advisor selection required at registration)
- Browse resources and create booking requests
- View “My Bookings” with point-to-point approval progress and booking details
- Policy remaining limits (daily/monthly bookings and hours)

### Staff
- Login
- Approve/Reject student booking requests assigned to them (advisor-based)
- View student bookings and booking statistics (Total / Pending / Approved / Rejected)
- Create their own bookings (go directly to Admin)
- Student management: view assigned students and active/inactive counts

### Admin
- Login
- Approve/Reject bookings pending admin stage
- Manage resources (create/update/status change)
- Manage users (list/update/soft delete)
- View all bookings

## Workflow (End-to-End)

### Authentication (JWT)
- Frontend stores JWT token + user in localStorage.
- Axios attaches `Authorization: Bearer <token>` automatically.

### Booking Approval Flow

Approval stages are defined in the backend enum `ApprovalStage`:
- `PENDING_STAFF`
- `PENDING_ADMIN`
- `APPROVED`
- `APPROVED_STAFF_ONLY`
- `REJECTED`
- `CANCELLED`

#### Student booking
1. Student creates a booking → `PENDING_STAFF`
2. Assigned Staff approves → moves to `PENDING_ADMIN`
3. Admin approves → `APPROVED` and visibility becomes `PUBLIC`
4. Staff/Admin can reject at their stage → `REJECTED`

#### Staff booking
1. Staff creates a booking → `PENDING_ADMIN` (skips staff review)
2. Admin approves → `APPROVED_STAFF_ONLY` and visibility becomes `STAFF_ONLY`
3. Admin can reject at admin stage → `REJECTED`

### Availability / Slot Rules
Slots are hourly and generated using operating rules:
- Operating hours: 9:00 AM to 4:00 PM
- Lunch break blocked: 12:30 PM to 1:30 PM
- Duration must be full hours only
- Past dates and past slots (for today) are not allowed
- A resource/time conflict exists if an overlapping booking exists and stage is NOT `REJECTED`/`CANCELLED`

### Booking Policy Limits
Policies are stored per-role (`booking_policy`). If `isUnlimited=true`, limits are ignored.
Otherwise, validations enforce:
- max bookings/day, bookings/month
- max hours/day, hours/month

## Database Structure (MySQL)

The system uses UUIDs stored as `CHAR(36)` in MySQL.

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

## API Overview

Base URL (backend): `http://localhost:8081`

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/advisors`
- `POST /api/auth/forgot-password/send-otp`
- `POST /api/auth/forgot-password/verify-otp`
- `POST /api/auth/forgot-password/reset-password`

### Bookings
- `POST /api/bookings` (STUDENT/STAFF/ADMIN)
- `GET /api/bookings/my`
- `GET /api/bookings/all` (ADMIN)
- `GET /api/bookings/slots/{resourceId}?date=YYYY-MM-DD`

### Approvals
- `GET /api/approvals/staff/pending` (STAFF)
- `PUT /api/approvals/staff/{bookingId}` (STAFF approve)
- `PUT /api/approvals/staff/{bookingId}/reject` (STAFF reject)
- `GET /api/approvals/staff/student-bookings` (STAFF)
- `GET /api/approvals/staff/stats` (STAFF)
- `GET /api/approvals/admin/pending` (ADMIN)
- `PUT /api/approvals/admin/{bookingId}` (ADMIN approve)
- `PUT /api/approvals/admin/{bookingId}/reject` (ADMIN reject)

### Resources (Full CRUD)
- `GET /api/resources` - List all resources (authenticated)
- `GET /api/resources/{id}` - Get single resource by ID (authenticated)
- `POST /api/resources` - Create new resource (ADMIN)
- `PUT /api/resources/{id}` - Update resource (ADMIN)
- `PATCH /api/resources/{id}/status` - Change resource status (ADMIN)
- `DELETE /api/resources/{id}` - Delete resource (ADMIN)

### Users
- `GET /api/users` (ADMIN)
- `PUT /api/users/{id}` (ADMIN)
- `DELETE /api/users/{id}` (ADMIN soft delete)
- `GET /api/users/my-students` (STAFF)
- `GET /api/users/my-students/stats` (STAFF)

### Policy
- `GET /api/policy/remaining`

## Frontend Pages (Routes)

- `/` portal selection (redirects based on role)
- `/login/:portal` and `/register/:portal`
- `/forgot-password`

Admin:
- `/admin` dashboard
- `/admin/resources`
- `/admin/users`

Staff:
- `/staff` dashboard (approvals + student bookings + create booking)
- `/staff/approvals`
- `/staff/students`
- `/staff/bookings`

Student:
- `/student` dashboard
- `/student/bookings`

## Local Setup

### Prerequisites
- Java 21
- Node.js 18+ (recommended)
- MySQL 8+

### Backend (Spring Boot)
1. Create a MySQL database:
	- `campus_db`
2. Update DB credentials in `backend/src/main/resources/application.properties` if needed.
3. Run:
	- Windows: `cd backend` then `./mvnw.cmd spring-boot:run`
4. Backend runs on: `http://localhost:8081`

### Frontend (React)
1. `cd frontend`
2. `npm install`
3. Optional: set API base URL in environment:
	- Create `frontend/.env` and add: `VITE_API_BASE_URL=http://localhost:8081`
4. Run:
	- `npm run dev`
5. Frontend runs on: `http://localhost:5173`

## Notes / Development Details

- OTP reset currently logs OTP to backend console (SMS gateway is TODO).
- Booking responses include both IDs and display names (`userName`, `resourceName`) to avoid showing UUIDs on UI.

## Push to GitHub

From the project root:
1. Initialize git (if not already):
	- `git init`
2. Add a root `.gitignore` (recommended) to exclude `node_modules/`, `frontend/dist/`, and `backend/target/`.
3. Commit:
	- `git add .`
	- `git commit -m "Initial commit"`
4. Add remote and push:
	- `git remote add origin https://github.com/<your-username>/<repo-name>.git`
	- `git branch -M main`
	- `git push -u origin main`
