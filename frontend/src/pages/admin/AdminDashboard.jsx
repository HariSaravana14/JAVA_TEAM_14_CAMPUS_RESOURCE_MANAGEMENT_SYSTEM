import { useEffect, useState } from 'react'
import Navbar from '../../components/layout/Navbar'
import Sidebar from '../../components/layout/Sidebar'
import BookingTable from '../../components/booking/BookingTable'
import { allBookings, adminApprove, adminReject } from '../../api/bookingApi'
import { getPolicyRemaining } from '../../api/policyApi'
import { extractErrorMessage } from '../../api/axiosInstance'

export default function AdminDashboard() {
	const [bookings, setBookings] = useState([])
	const [policy, setPolicy] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	const load = async () => {
		setLoading(true)
		setError('')
		try {
			const [b, p] = await Promise.all([allBookings(), getPolicyRemaining()])
			setBookings(b)
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

	const onAdminApprove = async (bookingId) => {
		setError('')
		try {
			await adminApprove(bookingId)
			await load()
		} catch (err) {
			setError(extractErrorMessage(err))
		}
	}

	const onAdminReject = async (bookingId) => {
		if (!confirm('Are you sure you want to reject this booking?')) return
		setError('')
		try {
			await adminReject(bookingId)
			await load()
		} catch (err) {
			setError(extractErrorMessage(err))
		}
	}

	// Calculate stats
	const pendingCount = bookings.filter(b => b.approvalStage === 'PENDING_ADMIN').length
	const approvedCount = bookings.filter(b => ['APPROVED', 'APPROVED_STAFF_ONLY'].includes(b.approvalStage)).length
	const rejectedCount = bookings.filter(b => b.approvalStage === 'REJECTED').length

	return (
		<div className="dashboard-layout">
			<Navbar />
			<div className="dashboard-container">
				<Sidebar />
				<main className="dashboard-main">
					<div className="page-header">
						<div className="page-header-content">
							<h1 className="page-title">Admin Dashboard</h1>
							<p className="page-subtitle">Manage all system bookings and approvals</p>
						</div>
					</div>

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
					<div className="stats-grid">
						<div className="stat-card stat-card-default">
							<span className="stat-value">{bookings.length}</span>
							<span className="stat-label">Total Bookings</span>
						</div>
						<div className="stat-card stat-card-warning">
							<span className="stat-value">{pendingCount}</span>
							<span className="stat-label">Pending Admin</span>
						</div>
						<div className="stat-card stat-card-success">
							<span className="stat-value">{approvedCount}</span>
							<span className="stat-label">Approved</span>
						</div>
						<div className="stat-card stat-card-error">
							<span className="stat-value">{rejectedCount}</span>
							<span className="stat-label">Rejected</span>
						</div>
					</div>

					{error && <div className="alert alert-error">{error}</div>}
					
					{loading ? (
						<div className="card loading-card">
							<div className="loading-spinner"></div>
							<span>Loading...</span>
						</div>
					) : (
						<BookingTable 
							bookings={bookings} 
							onAdminApprove={onAdminApprove} 
							onAdminReject={onAdminReject}
						/>
					)}
				</main>
			</div>
		</div>
	)
}

