import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function LinkItem({ to, label }) {
	return (
		<NavLink
			to={to}
			style={({ isActive }) => ({
				display: 'block',
				padding: '10px 12px',
				borderRadius: 10,
				border: '1px solid #e5e7eb',
				background: isActive ? '#111827' : 'white',
				color: isActive ? 'white' : '#111827',
			})}
		>
			{label}
		</NavLink>
	)
}

export default function Sidebar() {
	const { user } = useAuth()

	return (
		<div className="card" style={{ width: 260 }}>
			<div className="stack">
				{user?.role === 'ADMIN' && (
					<>
						<LinkItem to="/admin" label="Dashboard" />
						<LinkItem to="/admin/resources" label="Resources" />
						<LinkItem to="/admin/users" label="Users" />
					</>
				)}

				{user?.role === 'STAFF' && (
					<>
						<LinkItem to="/staff" label="Dashboard" />
						<LinkItem to="/staff/approvals" label="Approvals" />
						<LinkItem to="/staff/students" label="My Students" />
						<LinkItem to="/staff/bookings" label="My Bookings" />
					</>
				)}

				{user?.role === 'STUDENT' && (
					<>
						<LinkItem to="/student" label="Dashboard" />
						<LinkItem to="/student/bookings" label="My Bookings" />
					</>
				)}
			</div>
		</div>
	)
}

