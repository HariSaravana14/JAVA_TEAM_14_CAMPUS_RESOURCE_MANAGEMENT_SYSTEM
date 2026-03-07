import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function LinkItem({ to, label, icon }) {
	return (
		<NavLink
			to={to}
			className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
		>
			{icon && <span className="sidebar-link-icon">{icon}</span>}
			<span>{label}</span>
		</NavLink>
	)
}

// Simple SVG icons
const DashboardIcon = () => (
	<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
		<rect x="3" y="3" width="7" height="7" rx="1"/>
		<rect x="14" y="3" width="7" height="7" rx="1"/>
		<rect x="3" y="14" width="7" height="7" rx="1"/>
		<rect x="14" y="14" width="7" height="7" rx="1"/>
	</svg>
)

const ResourceIcon = () => (
	<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
		<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
	</svg>
)

const UsersIcon = () => (
	<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
		<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
		<circle cx="9" cy="7" r="4"/>
		<path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
		<path d="M16 3.13a4 4 0 0 1 0 7.75"/>
	</svg>
)

const ApprovalIcon = () => (
	<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
		<path d="M9 11l3 3L22 4"/>
		<path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
	</svg>
)

const BookingIcon = () => (
	<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
		<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
		<line x1="16" y1="2" x2="16" y2="6"/>
		<line x1="8" y1="2" x2="8" y2="6"/>
		<line x1="3" y1="10" x2="21" y2="10"/>
	</svg>
)

const StudentsIcon = () => (
	<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
		<path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
		<path d="M6 12v5c3 3 9 3 12 0v-5"/>
	</svg>
)

export default function Sidebar() {
	const { user } = useAuth()

	return (
		<aside className="sidebar">
			<nav className="sidebar-nav">
				{user?.role === 'ADMIN' && (
					<>
						<LinkItem to="/admin" label="Dashboard" icon={<DashboardIcon />} />
						<LinkItem to="/admin/resources" label="Resources" icon={<ResourceIcon />} />
						<LinkItem to="/admin/users" label="Users" icon={<UsersIcon />} />
					</>
				)}

				{user?.role === 'STAFF' && (
					<>
						<LinkItem to="/staff" label="Dashboard" icon={<DashboardIcon />} />
						<LinkItem to="/staff/approvals" label="Approvals" icon={<ApprovalIcon />} />
						<LinkItem to="/staff/students" label="My Students" icon={<StudentsIcon />} />
						<LinkItem to="/staff/bookings" label="My Bookings" icon={<BookingIcon />} />
					</>
				)}

				{user?.role === 'STUDENT' && (
					<>
						<LinkItem to="/student" label="Dashboard" icon={<DashboardIcon />} />
						<LinkItem to="/student/bookings" label="My Bookings" icon={<BookingIcon />} />
					</>
				)}
			</nav>
		</aside>
	)
}

