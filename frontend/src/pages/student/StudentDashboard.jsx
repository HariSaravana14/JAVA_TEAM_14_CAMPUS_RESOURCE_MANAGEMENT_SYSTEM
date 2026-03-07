import { useEffect, useMemo, useState } from 'react'
import Navbar from '../../components/layout/Navbar'
import Sidebar from '../../components/layout/Sidebar'
import ResourceCard from '../../components/resource/ResourceCard'
import BookingForm from '../../components/booking/BookingForm'
import { listResources } from '../../api/resourceApi'
import { createBooking } from '../../api/bookingApi'
import { getPolicyRemaining } from '../../api/policyApi'
import { extractErrorMessage } from '../../api/axiosInstance'

export default function StudentDashboard() {
	const [resources, setResources] = useState([])
	const [policy, setPolicy] = useState(null)
	const [selectedResourceId, setSelectedResourceId] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(true)

	const availableCount = useMemo(
		() => resources.filter((r) => r.status === 'AVAILABLE').length,
		[resources]
	)

	const load = async () => {
		setError('')
		setLoading(true)
		try {
			const [r, p] = await Promise.all([listResources(), getPolicyRemaining()])
			setResources(r)
			setPolicy(p)
		} catch (err) {
			setError(extractErrorMessage(err))
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		load()
	}, [])

	const handleCreate = async (payload) => {
		setError('')
		try {
			await createBooking(payload)
			await load()
		} catch (err) {
			throw new Error(extractErrorMessage(err))
		}
	}

	return (
		<div className="dashboard-layout">
			<Navbar />
			<div className="dashboard-container">
				<Sidebar />
				<main className="dashboard-main">
					<div className="page-header">
						<div className="page-header-content">
							<h1 className="page-title">Student Dashboard</h1>
							<p className="page-subtitle">
								Available resources: <strong>{availableCount}</strong>
							</p>
						</div>
					</div>

					{policy && (
						<div className="stats-grid">
							<div className="stat-card">
								<span className="stat-value">{policy.remainingBookingsToday}</span>
								<span className="stat-label">Bookings Today</span>
							</div>
							<div className="stat-card">
								<span className="stat-value">{policy.remainingHoursToday}h</span>
								<span className="stat-label">Hours Today</span>
							</div>
							<div className="stat-card">
								<span className="stat-value">{policy.remainingBookingsThisMonth}</span>
								<span className="stat-label">Bookings This Month</span>
							</div>
							<div className="stat-card">
								<span className="stat-value">{policy.remainingHoursThisMonth}h</span>
								<span className="stat-label">Hours This Month</span>
							</div>
						</div>
					)}

					{error && <div className="alert alert-error">{error}</div>}

					{loading ? (
						<div className="card loading-card">
							<div className="loading-spinner"></div>
							<span>Loading...</span>
						</div>
					) : (
						<>
							<BookingForm
								resources={resources}
								initialResourceId={selectedResourceId}
								onSubmit={handleCreate}
							/>

							<div className="card">
								<div className="card-header">
									<h2 className="card-title">Resources</h2>
								</div>
								<div className="resource-grid">
									{resources.map((r) => (
										<ResourceCard
											key={r.id}
											resource={r}
											onSelect={() => setSelectedResourceId(r.id)}
										/>
									))}
								</div>
							</div>
						</>
					)}
				</main>
			</div>
		</div>
	)
}

