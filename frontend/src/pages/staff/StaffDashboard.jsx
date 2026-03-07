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

	return (
		<div className="dashboard-layout">
			<Navbar />
			<div className="dashboard-container">
				<Sidebar />
				<main className="dashboard-main">
					{/* Header */}
					<div className="page-header">
						<div className="page-header-content">
							<h1 className="page-title">Staff Dashboard</h1>
							<p className="page-subtitle">Manage student bookings and approvals</p>
						</div>
					</div>

					{/* Policy Stats */}
					{policy && (
						<div className="stats-grid stats-grid-2">
							<div className="stat-card">
								<span className="stat-value">{policy.remainingBookingsToday}</span>
								<span className="stat-label">Bookings Today</span>
							</div>
							<div className="stat-card">
								<span className="stat-value">{policy.remainingHoursToday}h</span>
								<span className="stat-label">Hours Today</span>
							</div>
						</div>
					)}

					{/* Booking Statistics */}
					{bookingStats && (
						<div className="stats-grid">
							<div className="stat-card stat-card-default">
								<span className="stat-value">{bookingStats.totalBookings}</span>
								<span className="stat-label">Total Bookings</span>
							</div>
							<div className="stat-card stat-card-warning">
								<span className="stat-value">{bookingStats.pendingBookings}</span>
								<span className="stat-label">Pending</span>
							</div>
							<div className="stat-card stat-card-success">
								<span className="stat-value">{bookingStats.approvedBookings}</span>
								<span className="stat-label">Approved</span>
							</div>
							<div className="stat-card stat-card-error">
								<span className="stat-value">{bookingStats.rejectedBookings}</span>
								<span className="stat-label">Rejected</span>
							</div>
						</div>
					)}

					{/* Tab Navigation */}
					<div className="tabs-container">
						<div className="tabs">
							<button 
								className={`tab ${activeTab === 'overview' ? 'tab-active' : ''}`} 
								onClick={() => setActiveTab('overview')}
							>
								Pending Approvals
							</button>
							<button 
								className={`tab ${activeTab === 'bookings' ? 'tab-active' : ''}`} 
								onClick={() => setActiveTab('bookings')}
							>
								Student Bookings
							</button>
							<button 
								className={`tab ${activeTab === 'create' ? 'tab-active' : ''}`} 
								onClick={() => setActiveTab('create')}
							>
								Create Booking
							</button>
						</div>
					</div>

					{error && <div className="alert alert-error">{error}</div>}
					
					{loading && (
						<div className="card loading-card">
							<div className="loading-spinner"></div>
							<span>Loading...</span>
						</div>
					)}

					{/* Pending Approvals Tab */}
					{!loading && activeTab === 'overview' && (
						<div className="card">
							<div className="card-header">
								<h2 className="card-title">Pending Approvals ({pending.length})</h2>
							</div>
							{pending.length === 0 ? (
								<div className="empty-state">
									<p>No pending approvals.</p>
								</div>
							) : (
								<div className="table-container">
									<table className="table">
										<thead>
											<tr>
												<th>Booking ID</th>
												<th>Resource ID</th>
												<th>Date</th>
												<th>Time</th>
												<th>Hours</th>
												<th>Actions</th>
											</tr>
										</thead>
										<tbody>
											{pending.map((b) => (
												<tr key={b.id}>
													<td className="table-mono">{b.id.slice(0, 8)}...</td>
													<td className="table-mono">{b.resourceId.slice(0, 8)}...</td>
													<td>{b.bookingDate}</td>
													<td>{b.startTime} - {b.endTime}</td>
													<td>{b.durationHours}</td>
													<td>
														<div className="table-actions">
															<button 
																className="btn btn-success btn-sm"
																onClick={() => handleApprove(b.id)}
																disabled={actionInProgress === b.id}
															>
																{actionInProgress === b.id ? '...' : 'Approve'}
															</button>
															<button 
																className="btn btn-danger btn-sm"
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
						</div>
					)}

					{/* Student Bookings Tab */}
					{!loading && activeTab === 'bookings' && (
						<div className="card">
							<div className="card-header">
								<h2 className="card-title">All Student Bookings ({studentBookings.length})</h2>
							</div>
							{studentBookings.length === 0 ? (
								<div className="empty-state">
									<p>No student bookings found.</p>
								</div>
							) : (
								<div className="table-container">
									<table className="table">
										<thead>
											<tr>
												<th>Booking ID</th>
												<th>Resource</th>
												<th>Date</th>
												<th>Time</th>
												<th>Status</th>
											</tr>
										</thead>
										<tbody>
											{studentBookings.map((b) => (
												<tr key={b.id}>
													<td className="table-mono">{b.id.slice(0, 8)}...</td>
													<td className="table-mono">{b.resourceId.slice(0, 8)}...</td>
													<td>{b.bookingDate}</td>
													<td>{b.startTime} - {b.endTime}</td>
													<td>
														<span className={`badge badge-${b.approvalStage.toLowerCase().replace(/_/g, '-')}`}>
															{b.approvalStage.replace(/_/g, ' ')}
														</span>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
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
								<div className="card-header">
									<h2 className="card-title">Resources ({availableCount} available)</h2>
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