import { useEffect, useState } from 'react'
import Navbar from '../../components/layout/Navbar'
import Sidebar from '../../components/layout/Sidebar'
import { getPendingStaffApprovals, staffApprove, staffReject } from '../../api/bookingApi'
import { extractErrorMessage } from '../../api/axiosInstance'

export default function PendingApprovals() {
	const [pending, setPending] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [actionInProgress, setActionInProgress] = useState(null)

	const load = async () => {
		setLoading(true)
		setError('')
		try {
			setPending(await getPendingStaffApprovals())
		} catch (err) {
			setError(extractErrorMessage(err))
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		load()
	}, [])

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

	return (
		<div className="container stack">
			<Navbar />
			<div className="row" style={{ alignItems: 'flex-start' }}>
				<Sidebar />
				<div className="stack" style={{ flex: 1 }}>
					<div className="card">
						<div style={{ fontWeight: 800, fontSize: 18 }}>Pending Approvals</div>
						<div style={{ marginTop: 8, fontSize: 13, color: '#374151' }}>
							Review and approve/reject student booking requests
						</div>
					</div>

					{error ? <div className="error">{error}</div> : null}

					{loading ? (
						<div className="card">Loading...</div>
					) : pending.length === 0 ? (
						<div className="card" style={{ color: '#6b7280' }}>No pending approvals.</div>
					) : (
						<div className="card">
							<div style={{ fontWeight: 700, marginBottom: 12 }}>
								Pending Requests ({pending.length})
							</div>
							<table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
								<thead>
									<tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
										<th style={{ padding: '10px 8px' }}>Booking ID</th>
										<th style={{ padding: '10px 8px' }}>Resource</th>
										<th style={{ padding: '10px 8px' }}>Date</th>
										<th style={{ padding: '10px 8px' }}>Time</th>
										<th style={{ padding: '10px 8px' }}>Duration</th>
										<th style={{ padding: '10px 8px' }}>Actions</th>
									</tr>
								</thead>
								<tbody>
									{pending.map((b) => (
										<tr key={b.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
											<td style={{ padding: '12px 8px', fontFamily: 'monospace', fontSize: 12 }}>
												{b.id.slice(0, 8)}...
											</td>
											<td style={{ padding: '12px 8px', fontFamily: 'monospace', fontSize: 12 }}>
												{b.resourceId.slice(0, 8)}...
											</td>
											<td style={{ padding: '12px 8px' }}>{b.bookingDate}</td>
											<td style={{ padding: '12px 8px' }}>{b.startTime} - {b.endTime}</td>
											<td style={{ padding: '12px 8px' }}>{b.durationHours}h</td>
											<td style={{ padding: '12px 8px' }}>
												<div className="row" style={{ gap: 8 }}>
													<button
														className="button"
														style={{ 
															padding: '6px 14px', 
															fontSize: 13, 
															background: '#16a34a',
															minWidth: 80
														}}
														onClick={() => handleApprove(b.id)}
														disabled={actionInProgress === b.id}
													>
														{actionInProgress === b.id ? '...' : 'Approve'}
													</button>
													<button
														className="button"
														style={{ 
															padding: '6px 14px', 
															fontSize: 13, 
															background: '#dc2626',
															minWidth: 80
														}}
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
			</div>
		</div>
	)
}

