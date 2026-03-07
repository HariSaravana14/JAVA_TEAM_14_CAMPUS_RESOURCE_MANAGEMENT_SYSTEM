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
		<div className="dashboard-layout">
			<Navbar />
			<div className="dashboard-container">
				<Sidebar />
				<main className="dashboard-main">
					<div className="page-header">
						<div className="page-header-content">
							<h1 className="page-title">Pending Approvals</h1>
							<p className="page-subtitle">Review and approve/reject student booking requests</p>
						</div>
					</div>

					{error && <div className="alert alert-error">{error}</div>}

					{loading ? (
						<div className="card loading-card">
							<div className="loading-spinner"></div>
							<span>Loading...</span>
						</div>
					) : pending.length === 0 ? (
						<div className="card">
							<div className="empty-state">
								<p>No pending approvals.</p>
							</div>
						</div>
					) : (
						<div className="card">
							<div className="card-header">
								<h2 className="card-title">Pending Requests ({pending.length})</h2>
							</div>
							<div className="table-container">
								<table className="table">
									<thead>
										<tr>
											<th>Booking ID</th>
											<th>Resource</th>
											<th>Date</th>
											<th>Time</th>
											<th>Duration</th>
											<th>Actions</th>
										</tr>
									</thead>
									<tbody>
										{pending.map((b) => (
											<tr key={b.id}>
												<td>
													<code className="table-code">{b.id.slice(0, 8)}...</code>
												</td>
												<td>
													<code className="table-code">{b.resourceId.slice(0, 8)}...</code>
												</td>
												<td>{b.bookingDate}</td>
												<td>{b.startTime} - {b.endTime}</td>
												<td>{b.durationHours}h</td>
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
						</div>
					)}
				</main>
			</div>
		</div>
	)
}

