import { Link } from 'react-router-dom'

const portals = [
	{
		id: 'student',
		title: 'Student Portal',
		description: 'Access your bookings, view resources, and manage your reservations',
		color: '#2563eb',
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
		color: '#059669',
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
		color: '#dc2626',
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
		<div className="container" style={{ maxWidth: 900 }}>
			<div className="stack" style={{ alignItems: 'center', gap: 32 }}>
				<div style={{ textAlign: 'center' }}>
					<h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, color: '#111827' }}>
						Campus Resource Booking
					</h1>
					<p style={{ fontSize: 15, color: '#6b7280', marginTop: 8 }}>
						Select your portal to continue
					</p>
				</div>

				<div style={{ 
					display: 'grid', 
					gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
					gap: 20, 
					width: '100%' 
				}}>
					{portals.map((portal) => (
						<Link
							key={portal.id}
							to={`/login/${portal.id}`}
							style={{
								textDecoration: 'none',
								color: 'inherit',
							}}
						>
							<div
								className="card"
								style={{
									cursor: 'pointer',
									transition: 'all 0.2s ease',
									border: `2px solid transparent`,
									height: '100%',
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.borderColor = portal.color
									e.currentTarget.style.transform = 'translateY(-4px)'
									e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0,0,0,0.1)'
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.borderColor = 'transparent'
									e.currentTarget.style.transform = 'translateY(0)'
									e.currentTarget.style.boxShadow = ''
								}}
							>
								<div style={{ color: portal.color, marginBottom: 12 }}>
									{portal.icon}
								</div>
								<div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
									{portal.title}
								</div>
								<div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>
									{portal.description}
								</div>
								<div style={{ 
									marginTop: 16, 
									fontSize: 13, 
									fontWeight: 600, 
									color: portal.color,
									display: 'flex',
									alignItems: 'center',
									gap: 4
								}}>
									Login →
								</div>
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	)
}
