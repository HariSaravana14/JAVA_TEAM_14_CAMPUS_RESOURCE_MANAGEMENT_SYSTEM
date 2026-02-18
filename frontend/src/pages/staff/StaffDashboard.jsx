import { useEffect, useMemo, useState } from 'react'
import Navbar from '../../components/layout/Navbar'
import Sidebar from '../../components/layout/Sidebar'
import BookingForm from '../../components/booking/BookingForm'
import ResourceCard from '../../components/resource/ResourceCard'
import { getPolicyRemaining } from '../../api/policyApi'
import { listResources } from '../../api/resourceApi'
import { 
	getPendingStaffApprovals, 
	staffApprove, 
	staffReject,
	getStaffStudentBookings,
	getStaffBookingStats,
	createBooking
} from '../../api/bookingApi'
import { extractErrorMessage } from '../../api/axiosInstance'

export default function StaffDashboard() {
	const [policy, setPolicy] = useState(null)
	const [pending, setPending] = useState([])
	const [studentBookings, setStudentBookings] = useState([])
	const [bookingStats, setBookingStats] = useState(null)
	const [resources, setResources] = useState([])
	const [selectedResourceId, setSelectedResourceId] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(true)
	const [actionInProgress, setActionInProgress] = useState(null)
	const [activeTab, setActiveTab] = useState('overview')

	const availableCount = useMemo(
		() => resources.filter((r) => r.status === 'AVAILABLE').length,
		[resources]
	)

	const load = async () => {
		setLoading(true)
		setError('')
		try {
			const [policyData, pendingData, studentBookingsData, statsData, resourcesData] = await Promise.all([
				getPolicyRemaining(),
				getPendingStaffApprovals(),
				getStaffStudentBookings(),
				getStaffBookingStats(),
				listResources()
			])
			setPolicy(policyData)
			setPending(pendingData)
			setStudentBookings(studentBookingsData)
			setBookingStats(statsData)
			setResources(resourcesData)
		} catch (err) {
			setError(extractErrorMessage(err))
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => { load() }, [])

	const handleApprove = async (bookingId) => {
		setActionInProgress(bookingId)
		setError('')
		try {
			await staffApprove(bookingId)
			await load()
		} catch (err) {
			setError(extractErrorMessage(err))
		} finally {
			setActionInProgress(null)
		}
	}

	const handleReject = async (bookingId) => {
		if (!confirm('Are you sure you want to reject this booking?')) return
		setActionInProgress(bookingId)
		setError('')
		try {
			await staffReject(bookingId)
			await load()
		} catch (err) {
			setError(extractErrorMessage(err))
		} finally {
			setActionInProgress(null)
		}
	}

	const handleCreateBooking = async (payload) => {
		setError('')
		try {
			await createBooking(payload)
			await load()
		} catch (err) {
			throw new Error(extractErrorMessage(err))
		}
	}

	const getStatusBadgeStyle = (stage) => {
		switch (stage) {
			case 'APPROVED':
			case 'APPROVED_STAFF_ONLY':
				return { background: '#dcfce7', color: '#166534' }
			case 'REJECTED':
				return { background: '#fef2f2', color: '#991b1b' }
			case 'PENDING_STAFF':
			case 'PENDING_ADMIN':
				return { background: '#fef9c3', color: '#854d0e' }
			default:
				return { background: '#f3f4f6', color: '#374151' }
		}
	}

	const tabStyle = (isActive) => ({
		padding: '10px 20px',
		background: isActive ? '#111827' : 'transparent',
		color: isActive ? '#fff' : '#374151',
		border: 'none',
		borderRadius: 8,
		cursor: 'pointer',
		fontWeight: isActive ? 600 : 400,
		fontSize: 14
	})

	return (
		<div className="container stack">
			<Navbar />
			<div className="row" style={{ alignItems: 'flex-start' }}>
				<Sidebar />
				<div className="stack" style={{ flex: 1 }}>
					{/* Header Card */}
					<div className="card">
						<div style={{ fontWeight: 800, fontSize: 18 }}>Staff Dashboard</div>
						{policy ? (
							<div style={{ marginTop: 10 }} className="row">
								<span className="badge">Remaining bookings today: {policy.remainingBookingsToday}</span>
								<span className="badge">Remaining hours today: {policy.remainingHoursToday}</span>
							</div>
						) : null}
					</div>

					{/* Booking Statistics */}
					{bookingStats && (
						<div className="card">
							<div style={{ fontWeight: 700, marginBottom: 12 }}>Student Booking Statistics</div>
							<div className="row" style={{ gap: 16 }}>
								<div style={{ 
									flex: 1, 
									padding: 16, 
									background: '#f3f4f6', 
									borderRadius: 8, 
									textAlign: 'center' 
								}}>
									<div style={{ fontSize: 24, fontWeight: 700, color: '#111827' }}>
										{bookingStats.totalBookings}
									</div>
									<div style={{ fontSize: 12, color: '#6b7280' }}>Total Bookings</div>
								</div>
								<div style={{ 
									flex: 1, 
									padding: 16, 
									background: '#fef9c3', 
									borderRadius: 8, 
									textAlign: 'center' 
								}}>
									<div style={{ fontSize: 24, fontWeight: 700, color: '#854d0e' }}>
										{bookingStats.pendingBookings}
									</div>
									<div style={{ fontSize: 12, color: '#854d0e' }}>Pending</div>
								</div>
								<div style={{ 
									flex: 1, 
									padding: 16, 
									background: '#dcfce7', 
									borderRadius: 8, 
									textAlign: 'center' 
								}}>
									<div style={{ fontSize: 24, fontWeight: 700, color: '#166534' }}>
										{bookingStats.approvedBookings}
									</div>
									<div style={{ fontSize: 12, color: '#166534' }}>Approved</div>
								</div>
								<div style={{ 
									flex: 1, 
									padding: 16, 
									background: '#fef2f2', 
									borderRadius: 8, 
									textAlign: 'center' 
								}}>
									<div style={{ fontSize: 24, fontWeight: 700, color: '#991b1b' }}>
										{bookingStats.rejectedBookings}
									</div>
									<div style={{ fontSize: 12, color: '#991b1b' }}>Rejected</div>
								</div>
							</div>
						</div>
					)}

					{/* Tab Navigation */}
					<div className="card" style={{ padding: '8px 12px' }}>
						<div className="row" style={{ gap: 8 }}>
							<button style={tabStyle(activeTab === 'overview')} onClick={() => setActiveTab('overview')}>
								Pending Approvals
							</button>
							<button style={tabStyle(activeTab === 'bookings')} onClick={() => setActiveTab('bookings')}>
								Student Bookings
							</button>
							<button style={tabStyle(activeTab === 'create')} onClick={() => setActiveTab('create')}>
								Create Booking
							</button>
						</div>
					</div>

					{error ? <div className="error">{error}</div> : null}
					{loading ? <div className="card">Loading...</div> : null}

					{/* Pending Approvals Tab */}
					{!loading && activeTab === 'overview' && (
						<>
							{pending.length === 0 ? (
								<div className="card" style={{ color: '#6b7280' }}>No pending approvals.</div>
							) : (
								<div className="card">
									<div style={{ fontWeight: 700, marginBottom: 10 }}>Pending Approvals ({pending.length})</div>
									<table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
										<thead>
											<tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
												<th style={{ padding: '8px 6px' }}>Booking ID</th>
												<th style={{ padding: '8px 6px' }}>Resource ID</th>
												<th style={{ padding: '8px 6px' }}>Date</th>
												<th style={{ padding: '8px 6px' }}>Time</th>
												<th style={{ padding: '8px 6px' }}>Hours</th>
												<th style={{ padding: '8px 6px' }}>Actions</th>
											</tr>
										</thead>
										<tbody>
											{pending.map((b) => (
												<tr key={b.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
													<td style={{ padding: '8px 6px', fontFamily: 'monospace', fontSize: 12 }}>{b.id.slice(0, 8)}...</td>
													<td style={{ padding: '8px 6px', fontFamily: 'monospace', fontSize: 12 }}>{b.resourceId.slice(0, 8)}...</td>
													<td style={{ padding: '8px 6px' }}>{b.bookingDate}</td>
													<td style={{ padding: '8px 6px' }}>{b.startTime} - {b.endTime}</td>
													<td style={{ padding: '8px 6px' }}>{b.durationHours}</td>
													<td style={{ padding: '8px 6px' }}>
														<div className="row" style={{ gap: 6 }}>
															<button 
																className="button" 
																style={{ padding: '4px 12px', fontSize: 13, background: '#16a34a' }}
																onClick={() => handleApprove(b.id)}
																disabled={actionInProgress === b.id}
															>
																{actionInProgress === b.id ? '...' : 'Approve'}
															</button>
															<button 
																className="button" 
																style={{ padding: '4px 12px', fontSize: 13, background: '#dc2626' }}
																onClick={() => handleReject(b.id)}
																disabled={actionInProgress === b.id}
															>
																Reject
															</button>
														</div>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							)}
						</>
					)}

					{/* Student Bookings Tab */}
					{!loading && activeTab === 'bookings' && (
						<div className="card">
							<div style={{ fontWeight: 700, marginBottom: 10 }}>All Student Bookings ({studentBookings.length})</div>
							{studentBookings.length === 0 ? (
								<div style={{ color: '#6b7280', padding: 16 }}>No student bookings found.</div>
							) : (
								<table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
									<thead>
										<tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
											<th style={{ padding: '8px 6px' }}>Booking ID</th>
											<th style={{ padding: '8px 6px' }}>Resource</th>
											<th style={{ padding: '8px 6px' }}>Date</th>
											<th style={{ padding: '8px 6px' }}>Time</th>
											<th style={{ padding: '8px 6px' }}>Status</th>
										</tr>
									</thead>
									<tbody>
										{studentBookings.map((b) => (
											<tr key={b.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
												<td style={{ padding: '8px 6px', fontFamily: 'monospace', fontSize: 12 }}>{b.id.slice(0, 8)}...</td>
												<td style={{ padding: '8px 6px', fontFamily: 'monospace', fontSize: 12 }}>{b.resourceId.slice(0, 8)}...</td>
												<td style={{ padding: '8px 6px' }}>{b.bookingDate}</td>
												<td style={{ padding: '8px 6px' }}>{b.startTime} - {b.endTime}</td>
												<td style={{ padding: '8px 6px' }}>
													<span 
														className="badge" 
														style={getStatusBadgeStyle(b.approvalStage)}
													>
														{b.approvalStage.replace(/_/g, ' ')}
													</span>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							)}
						</div>
					)}

					{/* Create Booking Tab */}
					{!loading && activeTab === 'create' && (
						<>
							<BookingForm
								resources={resources}
								initialResourceId={selectedResourceId}
								onSubmit={handleCreateBooking}
							/>

							<div className="card">
								<div style={{ fontWeight: 700, marginBottom: 12 }}>
									Resources ({availableCount} available)
								</div>
								<div className="row" style={{ flexWrap: 'wrap' }}>
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