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
		<div className="container stack">
			<Navbar />
			<div className="row" style={{ alignItems: 'flex-start' }}>
				<Sidebar />
				<div className="stack" style={{ flex: 1 }}>
					<div className="card">
						<div style={{ fontWeight: 800, fontSize: 18 }}>Student Dashboard</div>
						<div style={{ marginTop: 8, color: '#374151', fontSize: 13 }}>
							Available resources: <b>{availableCount}</b>
						</div>
						{policy ? (
							<div style={{ marginTop: 10 }} className="row">
								<span className="badge">Remaining bookings today: {policy.remainingBookingsToday}</span>
								<span className="badge">Remaining hours today: {policy.remainingHoursToday}</span>
								<span className="badge">Remaining bookings this month: {policy.remainingBookingsThisMonth}</span>
								<span className="badge">Remaining hours this month: {policy.remainingHoursThisMonth}</span>
							</div>
						) : null}
					</div>

					{error ? <div className="error">{error}</div> : null}

					{loading ? (
						<div className="card">Loading...</div>
					) : (
						<>
							<BookingForm
								resources={resources}
								initialResourceId={selectedResourceId}
								onSubmit={handleCreate}
							/>

							<div className="card">
								<div style={{ fontWeight: 700, marginBottom: 12 }}>Resources</div>
								<div className="row">
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
				</div>
			</div>
		</div>
	)
}

