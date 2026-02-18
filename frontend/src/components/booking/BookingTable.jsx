import { formatDate, formatTime } from '../../utils/dateUtils'

export default function BookingTable({ bookings, onStaffApprove, onStaffReject, onAdminApprove, onAdminReject }) {
	const rows = bookings || []

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
			case 'CANCELLED':
				return { background: '#f3f4f6', color: '#6b7280' }
			default:
				return { background: '#f3f4f6', color: '#374151' }
		}
	}

	return (
		<div className="card">
			<div style={{ fontWeight: 700, marginBottom: 12 }}>Bookings ({rows.length})</div>
			<table className="table">
				<thead>
					<tr>
						<th>Date</th>
						<th>Start</th>
						<th>End</th>
						<th>Hours</th>
						<th>Status</th>
						<th>Resource</th>
						<th>User</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{rows.map((b) => (
						<tr key={b.id}>
							<td>{formatDate(b.bookingDate)}</td>
							<td>{formatTime(b.startTime)}</td>
							<td>{formatTime(b.endTime)}</td>
							<td>{b.durationHours}</td>
							<td>
								<span className="badge" style={getStatusBadgeStyle(b.approvalStage)}>
									{b.approvalStage.replace(/_/g, ' ')}
								</span>
							</td>
							<td>
								{b.resourceName || (
									<span style={{ fontFamily: 'monospace', fontSize: 11, color: '#9ca3af' }}>
										{b.resourceId?.slice(0, 8)}...
									</span>
								)}
							</td>
							<td>
								{b.userName || (
									<span style={{ fontFamily: 'monospace', fontSize: 11, color: '#9ca3af' }}>
										{b.userId?.slice(0, 8)}...
									</span>
								)}
							</td>
							<td style={{ whiteSpace: 'nowrap' }}>
								{onStaffApprove && b.approvalStage === 'PENDING_STAFF' ? (
									<div className="row" style={{ gap: 6 }}>
										<button 
											className="button" 
											type="button" 
											style={{ padding: '4px 10px', fontSize: 12, background: '#16a34a' }}
											onClick={() => onStaffApprove(b.id)}
										>
											Approve
										</button>
										{onStaffReject && (
											<button 
												className="button" 
												type="button" 
												style={{ padding: '4px 10px', fontSize: 12, background: '#dc2626' }}
												onClick={() => onStaffReject(b.id)}
											>
												Reject
											</button>
										)}
									</div>
								) : null}
								{onAdminApprove && b.approvalStage === 'PENDING_ADMIN' ? (
									<div className="row" style={{ gap: 6 }}>
										<button 
											className="button" 
											type="button" 
											style={{ padding: '4px 10px', fontSize: 12, background: '#16a34a' }}
											onClick={() => onAdminApprove(b.id)}
										>
											Approve
										</button>
										{onAdminReject && (
											<button 
												className="button" 
												type="button" 
												style={{ padding: '4px 10px', fontSize: 12, background: '#dc2626' }}
												onClick={() => onAdminReject(b.id)}
											>
												Reject
											</button>
										)}
									</div>
								) : null}
							</td>
						</tr>
					))}
					{rows.length === 0 ? (
						<tr>
							<td colSpan={8} style={{ padding: 14, color: '#6b7280' }}>
								No bookings found.
							</td>
						</tr>
					) : null}
				</tbody>
			</table>
		</div>
	)
}

