import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import { useAuth } from '../hooks/useAuth'

import PortalSelect from '../pages/auth/PortalSelect'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import ForgotPassword from '../pages/auth/ForgotPassword'

import AdminDashboard from '../pages/admin/AdminDashboard'
import ResourceManagement from '../pages/admin/ResourceManagement'
import UserManagement from '../pages/admin/UserManagement'

import StaffDashboard from '../pages/staff/StaffDashboard'
import PendingApprovals from '../pages/staff/PendingApprovals'
import MyStudents from '../pages/staff/MyStudents'
import StaffBookings from '../pages/staff/StaffBookings'

import StudentDashboard from '../pages/student/StudentDashboard'
import MyBookings from '../pages/student/MyBookings'

function HomeRedirect() {
	const { isAuthenticated, user } = useAuth()

	if (!isAuthenticated) return <PortalSelect />

	if (user?.role === 'ADMIN') return <Navigate to="/admin" replace />
	if (user?.role === 'STAFF') return <Navigate to="/staff" replace />
	return <Navigate to="/student" replace />
}

export default function AppRoutes() {
	return (
		<Routes>
			{/* Portal Selection */}
			<Route path="/" element={<HomeRedirect />} />

			{/* Role-specific Login Routes */}
			<Route path="/login" element={<Navigate to="/login/student" replace />} />
			<Route path="/login/:portal" element={<Login />} />

			{/* Role-specific Register Routes */}
			<Route path="/register" element={<Navigate to="/register/student" replace />} />
			<Route path="/register/:portal" element={<Register />} />

			<Route path="/forgot-password" element={<ForgotPassword />} />

			<Route element={<ProtectedRoute roles={["ADMIN"]} />}>
				<Route path="/admin" element={<AdminDashboard />} />
				<Route path="/admin/resources" element={<ResourceManagement />} />
				<Route path="/admin/users" element={<UserManagement />} />
			</Route>

			<Route element={<ProtectedRoute roles={["STAFF"]} />}>
				<Route path="/staff" element={<StaffDashboard />} />
				<Route path="/staff/approvals" element={<PendingApprovals />} />
				<Route path="/staff/students" element={<MyStudents />} />
				<Route path="/staff/bookings" element={<StaffBookings />} />
			</Route>

			<Route element={<ProtectedRoute roles={["STUDENT"]} />}>
				<Route path="/student" element={<StudentDashboard />} />
				<Route path="/student/bookings" element={<MyBookings />} />
			</Route>

			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	)
}

