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
	const [viewMode, setViewMode] = useState('table') // 'table' or 'cards'

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

	const getStatusBadgeStyle = (stage) => {
		switch (stage) {
			case 'APPROVED':
			case 'APPROVED_STAFF_ONLY':
				return { background: '#dcfce7', color: '#166534' }
			case 'REJECTED':
				return { background: '#fef2f2', color: '#991b1b' }
			case 'PENDING_STAFF':
				return { background: '#fef9c3', color: '#854d0e' }
			case 'PENDING_ADMIN':
				return { background: '#dbeafe', color: '#1d4ed8' }
			case 'CANCELLED':
				return { background: '#f3f4f6', color: '#6b7280' }
			default:
				return { background: '#f3f4f6', color: '#374151' }
		}
	}

	// Calculate stats
	const stats = {
		total: items.length,
		pending: items.filter(b => ['PENDING_STAFF', 'PENDING_ADMIN'].includes(b.approvalStage)).length,
		approved: items.filter(b => ['APPROVED', 'APPROVED_STAFF_ONLY'].includes(b.approvalStage)).length,
		rejected: items.filter(b => b.approvalStage === 'REJECTED').length
	}

	return (
		<div className="container stack">
			<Navbar />
			<div className="row" style={{ alignItems: 'flex-start' }}>
				<Sidebar />
				<div style={{ flex: 1 }} className="stack">
					<div className="card">
						<div style={{ fontWeight: 800, fontSize: 18 }}>My Bookings</div>
						<div style={{ marginTop: 8, fontSize: 13, color: '#374151' }}>
							Track and manage your resource booking requests
						</div>
					</div>

					{/* Statistics */}
					<div className="card">
						<div style={{ fontWeight: 700, marginBottom: 12 }}>Booking Overview</div>
						<div className="row" style={{ gap: 12 }}>
							<div style={{ 
								flex: 1, 
								padding: 14, 
								background: '#f3f4f6', 
								borderRadius: 8, 
								textAlign: 'center' 
							}}>
								<div style={{ fontSize: 22, fontWeight: 700, color: '#111827' }}>{stats.total}</div>
								<div style={{ fontSize: 11, color: '#6b7280' }}>Total</div>
							</div>
							<div style={{ 
								flex: 1, 
								padding: 14, 
								background: '#fef9c3', 
								borderRadius: 8, 
								textAlign: 'center' 
							}}>
								<div style={{ fontSize: 22, fontWeight: 700, color: '#854d0e' }}>{stats.pending}</div>
								<div style={{ fontSize: 11, color: '#854d0e' }}>Pending</div>
							</div>
							<div style={{ 
								flex: 1, 
								padding: 14, 
								background: '#dcfce7', 
								borderRadius: 8, 
								textAlign: 'center' 
							}}>
								<div style={{ fontSize: 22, fontWeight: 700, color: '#166534' }}>{stats.approved}</div>
								<div style={{ fontSize: 11, color: '#166534' }}>Approved</div>
							</div>
							<div style={{ 
								flex: 1, 
								padding: 14, 
								background: '#fef2f2', 
								borderRadius: 8, 
								textAlign: 'center' 
							}}>
								<div style={{ fontSize: 22, fontWeight: 700, color: '#991b1b' }}>{stats.rejected}</div>
								<div style={{ fontSize: 11, color: '#991b1b' }}>Rejected</div>
							</div>
						</div>
					</div>

					{/* View Toggle */}
					<div className="card" style={{ padding: '8px 12px' }}>
						<div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
							<span style={{ fontSize: 13, color: '#6b7280' }}>View as:</span>
							<div className="row" style={{ gap: 8 }}>
								<button
									style={{
										padding: '6px 14px',
										borderRadius: 6,
										border: '1px solid #e5e7eb',
										background: viewMode === 'table' ? '#111827' : 'white',
										color: viewMode === 'table' ? 'white' : '#374151',
										fontSize: 13,
										cursor: 'pointer'
									}}
									onClick={() => setViewMode('table')}
								>
									Table
								</button>
								<button
									style={{
										padding: '6px 14px',
										borderRadius: 6,
										border: '1px solid #e5e7eb',
										background: viewMode === 'cards' ? '#111827' : 'white',
										color: viewMode === 'cards' ? 'white' : '#374151',
										fontSize: 13,
										cursor: 'pointer'
									}}
									onClick={() => setViewMode('cards')}
								>
									Cards
								</button>
							</div>
						</div>
					</div>

					{error ? <div className="error">{error}</div> : null}
					
					{loading ? (
						<div className="card">Loading...</div>
					) : items.length === 0 ? (
						<div className="card" style={{ color: '#6b7280', textAlign: 'center', padding: 32 }}>
							No bookings found. Create your first booking from the Dashboard.
						</div>
					) : viewMode === 'table' ? (
						/* Table View */
						<div className="card">
							<div style={{ fontWeight: 700, marginBottom: 12 }}>All Bookings ({items.length})</div>
							<table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
								<thead>
									<tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
										<th style={{ padding: '10px 8px' }}>Date</th>
										<th style={{ padding: '10px 8px' }}>Time</th>
										<th style={{ padding: '10px 8px' }}>Hours</th>
										<th style={{ padding: '10px 8px' }}>Resource</th>
										<th style={{ padding: '10px 8px' }}>Status</th>
										<th style={{ padding: '10px 8px' }}>Progress</th>
										<th style={{ padding: '10px 8px' }}></th>
									</tr>
								</thead>
								<tbody>
									{items.map((b) => (
										<tr key={b.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
											<td style={{ padding: '12px 8px' }}>{formatDate(b.bookingDate)}</td>
											<td style={{ padding: '12px 8px' }}>{formatTime(b.startTime)} - {formatTime(b.endTime)}</td>
											<td style={{ padding: '12px 8px' }}>{b.durationHours}</td>
											<td style={{ padding: '12px 8px' }}>
												{getResourceName(b.resourceId) || (
													<span style={{ fontFamily: 'monospace', fontSize: 11 }}>
														{b.resourceId?.slice(0, 8)}...
													</span>
												)}
											</td>
											<td style={{ padding: '12px 8px' }}>
												<span 
													className="badge" 
													style={getStatusBadgeStyle(b.approvalStage)}
												>
													{b.approvalStage.replace(/_/g, ' ')}
												</span>
											</td>
											<td style={{ padding: '12px 8px', minWidth: 200 }}>
												<div style={{ transform: 'scale(0.7)', transformOrigin: 'left center' }}>
													<ApprovalStatusTracker stage={b.approvalStage} />
												</div>
											</td>
											<td style={{ padding: '12px 8px' }}>
												<button
													style={{
														padding: '4px 10px',
														fontSize: 12,
														background: '#f3f4f6',
														border: '1px solid #e5e7eb',
														borderRadius: 4,
														cursor: 'pointer'
													}}
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
					) : (
						/* Cards View */
						<div className="stack" style={{ gap: 16 }}>
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
						<div 
							style={{
								position: 'fixed',
								top: 0,
								left: 0,
								right: 0,
								bottom: 0,
								background: 'rgba(0,0,0,0.5)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								zIndex: 1000,
								padding: 20
							}}
							onClick={() => setSelectedBooking(null)}
						>
							<div 
								style={{ maxWidth: 600, width: '100%' }}
								onClick={e => e.stopPropagation()}
							>
								<BookingDetailsCard 
									booking={selectedBooking} 
									resourceName={getResourceName(selectedBooking.resourceId)}
								/>
								<button
									className="button"
									style={{ marginTop: 12, width: '100%', background: '#6b7280' }}
									onClick={() => setSelectedBooking(null)}
								>
									Close
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

