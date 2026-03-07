import { Link } from 'react-router-dom'

const portals = [
	{
		id: 'student',
		title: 'Student Portal',
		description: 'Access your bookings, view resources, and manage your reservations',
		className: 'student',
		icon: (
			<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
				<path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
				<path d="M6 12v5c3 3 9 3 12 0v-5"/>
			</svg>
		),
	},
	{
		id: 'staff',
		title: 'Staff Portal',
		description: 'Manage student approvals and oversee resource bookings',
		className: 'staff',
		icon: (
			<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
				<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
				<circle cx="9" cy="7" r="4"/>
				<path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
				<path d="M16 3.13a4 4 0 0 1 0 7.75"/>
			</svg>
		),
	},
	{
		id: 'admin',
		title: 'Admin Portal',
		description: 'System administration, user management, and resource configuration',
		className: 'admin',
		icon: (
			<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
				<circle cx="12" cy="12" r="3"/>
				<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
			</svg>
		),
	},
]

export default function PortalSelect() {
	return (
		<div className="portal-container">
			<div className="portal-header">
				<h1 className="portal-title">Campus Resource Booking</h1>
				<p className="portal-subtitle">Select your portal to continue</p>
			</div>

			<div className="portal-grid">
				{portals.map((portal) => (
					<Link
						key={portal.id}
						to={`/login/${portal.id}`}
						className={`portal-card portal-card-${portal.className}`}
					>
						<div className={`portal-icon portal-icon-${portal.className}`}>
							{portal.icon}
						</div>
						<h3 className="portal-card-title">{portal.title}</h3>
						<p className="portal-card-description">{portal.description}</p>
						<span className="portal-card-arrow">
							Login 
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
								<path d="M5 12h14M12 5l7 7-7 7"/>
							</svg>
						</span>
					</Link>
				))}
			</div>
		</div>
	)
}
