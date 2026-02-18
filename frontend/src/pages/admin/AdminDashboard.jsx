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
		<div className="container stack">
			<Navbar />
			<div className="row" style={{ alignItems: 'flex-start' }}>
				<Sidebar />
				<div className="stack" style={{ flex: 1 }}>
					<div className="card">
						<div style={{ fontWeight: 800, fontSize: 18 }}>Admin Dashboard</div>
						{policy ? (
							<div style={{ marginTop: 10 }} className="row">
								<span className="badge">Remaining bookings today: {policy.remainingBookingsToday}</span>
								<span className="badge">Remaining hours today: {policy.remainingHoursToday}</span>
								<span className="badge">Remaining bookings this month: {policy.remainingBookingsThisMonth}</span>
								<span className="badge">Remaining hours this month: {policy.remainingHoursThisMonth}</span>
							</div>
						) : null}
					</div>

					{/* Booking Statistics */}
					<div className="card">
						<div style={{ fontWeight: 700, marginBottom: 12 }}>Booking Statistics</div>
						<div className="row" style={{ gap: 16 }}>
							<div style={{ 
								flex: 1, 
								padding: 16, 
								background: '#f3f4f6', 
								borderRadius: 8, 
								textAlign: 'center' 
							}}>
								<div style={{ fontSize: 24, fontWeight: 700, color: '#111827' }}>
									{bookings.length}
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
									{pendingCount}
								</div>
								<div style={{ fontSize: 12, color: '#854d0e' }}>Pending Admin</div>
							</div>
							<div style={{ 
								flex: 1, 
								padding: 16, 
								background: '#dcfce7', 
								borderRadius: 8, 
								textAlign: 'center' 
							}}>
								<div style={{ fontSize: 24, fontWeight: 700, color: '#166534' }}>
									{approvedCount}
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
									{rejectedCount}
								</div>
								<div style={{ fontSize: 12, color: '#991b1b' }}>Rejected</div>
							</div>
						</div>
					</div>

					{error ? <div className="error">{error}</div> : null}
					{loading ? (
						<div className="card">Loading...</div>
					) : (
						<BookingTable 
							bookings={bookings} 
							onAdminApprove={onAdminApprove} 
							onAdminReject={onAdminReject}
						/>
					)}
				</div>
			</div>
		</div>
	)
}

