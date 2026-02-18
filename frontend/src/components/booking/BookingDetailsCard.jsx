import ApprovalStatusTracker from './ApprovalStatusTracker'
import { formatDate, formatTime } from '../../utils/dateUtils'

export default function BookingDetailsCard({ booking, resourceName, onCancel }) {
	const isStaffBooking = booking.approvalStage === 'PENDING_ADMIN' && !booking.staffApprovedBy
	
	const getStatusInfo = (stage) => {
		switch (stage) {
			case 'APPROVED':
			case 'APPROVED_STAFF_ONLY':
				return { label: 'Approved', color: '#16a34a', bg: '#dcfce7' }
			case 'REJECTED':
				return { label: 'Rejected', color: '#dc2626', bg: '#fef2f2' }
			case 'PENDING_STAFF':
				return { label: 'Awaiting Staff Approval', color: '#854d0e', bg: '#fef9c3' }
			case 'PENDING_ADMIN':
				return { label: 'Awaiting Admin Approval', color: '#1d4ed8', bg: '#dbeafe' }
			case 'CANCELLED':
				return { label: 'Cancelled', color: '#6b7280', bg: '#f3f4f6' }
			default:
				return { label: stage, color: '#374151', bg: '#f3f4f6' }
		}
	}

	const statusInfo = getStatusInfo(booking.approvalStage)
	const canCancel = ['PENDING_STAFF', 'PENDING_ADMIN'].includes(booking.approvalStage)

	return (
		<div className="card" style={{ padding: 0, overflow: 'hidden' }}>
			{/* Header */}
			<div style={{ 
				padding: '16px 20px', 
				borderBottom: '1px solid #e5e7eb',
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center'
			}}>
				<div>
					<div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>BOOKING ID</div>
					<div style={{ fontFamily: 'monospace', fontSize: 13 }}>{booking.id}</div>
				</div>
				<div style={{
					padding: '6px 12px',
					borderRadius: 20,
					background: statusInfo.bg,
					color: statusInfo.color,
					fontSize: 12,
					fontWeight: 600
				}}>
					{statusInfo.label}
				</div>
			</div>

			{/* Approval Progress Tracker */}
			<div style={{ borderBottom: '1px solid #e5e7eb' }}>
				<div style={{ padding: '8px 20px 0', fontSize: 12, color: '#6b7280', fontWeight: 500 }}>
					Approval Progress
				</div>
				<ApprovalStatusTracker 
					stage={booking.approvalStage} 
					isStaffBooking={isStaffBooking}
				/>
			</div>

			{/* Booking Details */}
			<div style={{ padding: '20px' }}>
				<div style={{ 
					display: 'grid', 
					gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
					gap: 20 
				}}>
					<div>
						<div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>DATE</div>
						<div style={{ fontWeight: 600, fontSize: 15 }}>{formatDate(booking.bookingDate)}</div>
					</div>
					<div>
						<div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>TIME</div>
						<div style={{ fontWeight: 600, fontSize: 15 }}>
							{formatTime(booking.startTime)} - {formatTime(booking.endTime)}
						</div>
					</div>
					<div>
						<div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>DURATION</div>
						<div style={{ fontWeight: 600, fontSize: 15 }}>{booking.durationHours} hour(s)</div>
					</div>
					<div>
						<div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>RESOURCE</div>
						<div style={{ fontWeight: 600, fontSize: 15 }}>
							{booking.resourceName || resourceName || (
								<span style={{ fontFamily: 'monospace', fontSize: 12 }}>
									{booking.resourceId?.slice(0, 12)}...
								</span>
							)}
						</div>
					</div>
				</div>

				{/* Approval Timeline */}
				{(booking.staffApprovedAt || booking.adminApprovedAt) && (
					<div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #e5e7eb' }}>
						<div style={{ fontSize: 12, color: '#6b7280', marginBottom: 12, fontWeight: 500 }}>
							Approval Timeline
						</div>
						<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
							{booking.staffApprovedAt && (
								<div style={{ 
									display: 'flex', 
									alignItems: 'center', 
									gap: 10,
									fontSize: 13
								}}>
									<div style={{
										width: 8,
										height: 8,
										borderRadius: '50%',
										background: '#16a34a'
									}} />
									<span style={{ color: '#374151' }}>
										Staff approved by {booking.staffApprovedByName || 'Staff'}
									</span>
									<span style={{ color: '#9ca3af', fontSize: 12 }}>
										{new Date(booking.staffApprovedAt).toLocaleString()}
									</span>
								</div>
							)}
							{booking.adminApprovedAt && (
								<div style={{ 
									display: 'flex', 
									alignItems: 'center', 
									gap: 10,
									fontSize: 13
								}}>
									<div style={{
										width: 8,
										height: 8,
										borderRadius: '50%',
										background: '#16a34a'
									}} />
									<span style={{ color: '#374151' }}>
										Admin approved by {booking.adminApprovedByName || 'Admin'}
									</span>
									<span style={{ color: '#9ca3af', fontSize: 12 }}>
										{new Date(booking.adminApprovedAt).toLocaleString()}
									</span>
								</div>
							)}
						</div>
					</div>
				)}

				{/* Cancel Button */}
				{canCancel && onCancel && (
					<div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #e5e7eb' }}>
						<button 
							className="button"
							style={{ 
								background: '#dc2626', 
								padding: '8px 16px',
								fontSize: 13
							}}
							onClick={() => onCancel(booking.id)}
						>
							Cancel Booking
						</button>
					</div>
				)}
			</div>
		</div>
	)
}
