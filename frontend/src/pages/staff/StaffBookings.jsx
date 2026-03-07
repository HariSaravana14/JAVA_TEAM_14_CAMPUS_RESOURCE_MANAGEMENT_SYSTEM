import { useEffect, useState } from 'react'
import Navbar from '../../components/layout/Navbar'
import Sidebar from '../../components/layout/Sidebar'
import BookingDetailsCard from '../../components/booking/BookingDetailsCard'
import ApprovalStatusTracker from '../../components/booking/ApprovalStatusTracker'
import { myBookings } from '../../api/bookingApi'
import { listResources } from '../../api/resourceApi'
import { extractErrorMessage } from '../../api/axiosInstance'
import { formatDate, formatTime } from '../../utils/dateUtils'

export default function StaffBookings() {
	const [items, setItems] = useState([])
	const [resources, setResources] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [selectedBooking, setSelectedBooking] = useState(null)
	const [viewMode, setViewMode] = useState('table')

	useEffect(() => {
		const run = async () => {
			setLoading(true)
			setError('')
			try {
				const [bookingsData, resourcesData] = await Promise.all([
					myBookings(),
					listResources()
				])
				setItems(bookingsData)
				setResources(resourcesData)
			} catch (err) {
				setError(extractErrorMessage(err))
			} finally {
				setLoading(false)
			}
		}
		run()
	}, [])

	const getResourceName = (resourceId) => {
		const resource = resources.find(r => r.id === resourceId)
		return resource?.name || null
	}

	// Calculate stats
	const stats = {
		total: items.length,
		pending: items.filter(b => ['PENDING_STAFF', 'PENDING_ADMIN'].includes(b.approvalStage)).length,
		approved: items.filter(b => ['APPROVED', 'APPROVED_STAFF_ONLY'].includes(b.approvalStage)).length,
		rejected: items.filter(b => b.approvalStage === 'REJECTED').length
	}

	return (
		<div className="dashboard-layout">
			<Navbar />
			<div className="dashboard-container">
				<Sidebar />
				<main className="dashboard-main">
					<div className="page-header">
						<div className="page-header-content">
							<h1 className="page-title">My Bookings</h1>
							<p className="page-subtitle">View and track your own resource booking requests</p>
						</div>
					</div>

					{/* Statistics */}
					<div className="stats-grid">
						<div className="stat-card stat-card-default">
							<div className="stat-number">{stats.total}</div>
							<div className="stat-label">Total</div>
						</div>
						<div className="stat-card stat-card-info">
							<div className="stat-number">{stats.pending}</div>
							<div className="stat-label">Pending Admin</div>
						</div>
						<div className="stat-card stat-card-success">
							<div className="stat-number">{stats.approved}</div>
							<div className="stat-label">Approved</div>
						</div>
						<div className="stat-card stat-card-danger">
							<div className="stat-number">{stats.rejected}</div>
							<div className="stat-label">Rejected</div>
						</div>
					</div>

					{/* Info Banner */}
					<div className="alert alert-info">
						<span className="alert-icon">ℹ️</span>
						<span>As a staff member, your bookings go directly to Admin for approval (skipping staff review).</span>
					</div>

					{/* View Toggle */}
					<div className="tabs-container">
						<div className="tabs-header">
							<span className="tabs-label">View as:</span>
							<div className="tabs">
								<button
									className={`tab ${viewMode === 'table' ? 'tab-active' : ''}`}
									onClick={() => setViewMode('table')}
								>
									Table
								</button>
								<button
									className={`tab ${viewMode === 'cards' ? 'tab-active' : ''}`}
									onClick={() => setViewMode('cards')}
								>
									Cards
								</button>
							</div>
						</div>
					</div>

					{error && <div className="alert alert-error">{error}</div>}
					
					{loading ? (
						<div className="card loading-card">
							<div className="loading-spinner"></div>
							<span>Loading...</span>
						</div>
					) : items.length === 0 ? (
						<div className="card">
							<div className="empty-state">
								<p>No bookings found. Create your first booking from the Dashboard.</p>
							</div>
						</div>
					) : viewMode === 'table' ? (
						/* Table View */
						<div className="card">
							<div className="card-header">
								<h2 className="card-title">All Bookings ({items.length})</h2>
							</div>
							<div className="table-container">
								<table className="table">
									<thead>
										<tr>
											<th>Date</th>
											<th>Time</th>
											<th>Hours</th>
											<th>Resource</th>
											<th>Status</th>
											<th>Progress</th>
											<th></th>
										</tr>
									</thead>
									<tbody>
										{items.map((b) => (
											<tr key={b.id}>
												<td>{formatDate(b.bookingDate)}</td>
												<td>{formatTime(b.startTime)} - {formatTime(b.endTime)}</td>
												<td>{b.durationHours}</td>
												<td>
													{getResourceName(b.resourceId) || (
														<code className="table-code">{b.resourceId?.slice(0, 8)}...</code>
													)}
												</td>
												<td>
													<span className={`badge badge-${b.approvalStage.toLowerCase().replace(/_/g, '-')}`}>
														{b.approvalStage.replace(/_/g, ' ')}
													</span>
												</td>
												<td className="progress-cell">
													<div className="progress-tracker-mini">
														<ApprovalStatusTracker stage={b.approvalStage} isStaffBooking={true} />
													</div>
												</td>
												<td>
													<button
														className="btn btn-ghost btn-sm"
														onClick={() => setSelectedBooking(b)}
													>
														Details
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					) : (
						/* Cards View */
						<div className="cards-grid">
							{items.map((b) => (
								<BookingDetailsCard 
									key={b.id} 
									booking={b} 
									resourceName={getResourceName(b.resourceId)}
								/>
							))}
						</div>
					)}

					{/* Booking Details Modal */}
					{selectedBooking && (
						<div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
							<div className="modal-content" onClick={e => e.stopPropagation()}>
								<BookingDetailsCard 
									booking={selectedBooking} 
									resourceName={getResourceName(selectedBooking.resourceId)}
								/>
								<button
									className="btn btn-secondary btn-block"
									onClick={() => setSelectedBooking(null)}
								>
									Close
								</button>
							</div>
						</div>
					)}
				</main>
			</div>
		</div>
	)
}
