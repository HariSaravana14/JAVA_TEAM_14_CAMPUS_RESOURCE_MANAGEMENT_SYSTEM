import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute({ roles }) {
	const { isAuthenticated, user } = useAuth()

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />
	}

	if (roles?.length && user?.role && !roles.includes(user.role)) {
		return <Navigate to="/" replace />
	}

	return <Outlet />
}

