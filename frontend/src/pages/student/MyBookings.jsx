import { useEffect, useState } from 'react'
import Navbar from '../../components/layout/Navbar'
import Sidebar from '../../components/layout/Sidebar'
import BookingDetailsCard from '../../components/booking/BookingDetailsCard'
import ApprovalStatusTracker from '../../components/booking/ApprovalStatusTracker'
import { myBookings } from '../../api/bookingApi'
import { listResources } from '../../api/resourceApi'
import { extractErrorMessage } from '../../api/axiosInstance'
import { formatDate, formatTime } from '../../utils/dateUtils'

export default function MyBookings() {
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
							<p className="page-subtitle">Track and manage your resource booking requests</p>
						</div>
					</div>

					{/* Statistics */}
					<div className="stats-grid">
						<div className="stat-card stat-card-default">
							<span className="stat-value">{stats.total}</span>
							<span className="stat-label">Total</span>
						</div>
						<div className="stat-card stat-card-warning">
							<span className="stat-value">{stats.pending}</span>
							<span className="stat-label">Pending</span>
						</div>
						<div className="stat-card stat-card-success">
							<span className="stat-value">{stats.approved}</span>
							<span className="stat-label">Approved</span>
						</div>
						<div className="stat-card stat-card-error">
							<span className="stat-value">{stats.rejected}</span>
							<span className="stat-label">Rejected</span>
						</div>
					</div>

					{/* View Toggle */}
					<div className="tabs-container">
						<div className="tabs">
							<span className="tab-label">View as:</span>
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
														<span className="table-mono">{b.resourceId?.slice(0, 8)}...</span>
													)}
												</td>
												<td>
													<span className={`badge badge-${b.approvalStage.toLowerCase().replace(/_/g, '-')}`}>
														{b.approvalStage.replace(/_/g, ' ')}
													</span>
												</td>
												<td style={{ minWidth: 200 }}>
													<div style={{ transform: 'scale(0.7)', transformOrigin: 'left center' }}>
														<ApprovalStatusTracker stage={b.approvalStage} />
													</div>
												</td>
												<td>
													<button
														className="btn btn-sm"
														style={{ background: 'var(--gray-100)', color: 'var(--gray-700)' }}
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
						<div className="booking-cards-grid">
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
									className="btn modal-close-btn"
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

