import { useEffect, useState } from 'react'
import Navbar from '../../components/layout/Navbar'
import Sidebar from '../../components/layout/Sidebar'
import { getMyStudents, getMyStudentStats, updateUser } from '../../api/userApi'
import { extractErrorMessage } from '../../api/axiosInstance'

export default function MyStudents() {
	const [students, setStudents] = useState([])
	const [stats, setStats] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [updating, setUpdating] = useState(null)
	const [sidebarOpen, setSidebarOpen] = useState(false)

	const load = async () => {
		setLoading(true)
		setError('')
		try {
			const [studentsData, statsData] = await Promise.all([
				getMyStudents(),
				getMyStudentStats()
			])
			setStudents(studentsData)
			setStats(statsData)
		} catch (err) {
			setError(extractErrorMessage(err))
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		load()
	}, [])

	const onToggleStatus = async (student) => {
		const newStatus = student.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
		const action = newStatus === 'ACTIVE' ? 'activate' : 'deactivate'
		
		if (!window.confirm(`Are you sure you want to ${action} "${student.name}"?`)) {
			return
		}
		
		setUpdating(student.id)
		setError('')
		try {
			await updateUser(student.id, { status: newStatus })
			await load()
		} catch (err) {
			setError(extractErrorMessage(err))
		} finally {
			setUpdating(null)
		}
	}

	return (
		<div className="dashboard-layout">
			<Navbar onMenuToggle={() => setSidebarOpen((v) => !v)} />
			<div className="dashboard-container">
				<Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
				<main className="dashboard-main">
					<div className="page-header">
						<div className="page-header-content">
							<h1 className="page-title">My Students</h1>
							<p className="page-subtitle">View and manage students assigned to you</p>
						</div>
					</div>

					{/* Student Statistics */}
					{stats && (
						<div className="stats-grid">
							<div className="stat-card stat-card-default">
								<div className="stat-number">{stats.totalStudents}</div>
								<div className="stat-label">Total Students</div>
							</div>
							<div className="stat-card stat-card-success">
								<div className="stat-number">{stats.activeStudents}</div>
								<div className="stat-label">Active Students</div>
							</div>
							<div className="stat-card stat-card-danger">
								<div className="stat-number">{stats.inactiveStudents}</div>
								<div className="stat-label">Inactive Students</div>
							</div>
						</div>
					)}

					{error && <div className="alert alert-error">{error}</div>}

					{loading ? (
						<div className="card loading-card">
							<div className="loading-spinner"></div>
							<span>Loading...</span>
						</div>
					) : (
						<div className="card">
							<div className="card-header">
								<h2 className="card-title">Student List ({students.length})</h2>
							</div>
							{students.length === 0 ? (
								<div className="empty-state">
									<p>No students assigned to you yet.</p>
								</div>
							) : (
								<div className="table-container">
									<table className="table">
										<thead>
											<tr>
												<th>Name</th>
												<th>Email</th>
												<th>Phone</th>
												<th>Status</th>
												<th>Action</th>
											</tr>
										</thead>
										<tbody>
											{students.map((student) => (
												<tr key={student.id}>
													<td className="table-bold">{student.name}</td>
													<td className="table-muted">{student.email}</td>
													<td className="table-muted">{student.phone || '-'}</td>
													<td>
														<span className={`badge badge-${student.status.toLowerCase()}`}>
															{student.status}
														</span>
													</td>
													<td>
														{student.status === 'ACTIVE' ? (
															<button
																className="btn btn-danger btn-sm"
																onClick={() => onToggleStatus(student)}
																disabled={updating === student.id}
															>
																{updating === student.id ? 'Updating...' : 'Deactivate'}
															</button>
														) : (
															<button
																className="btn btn-success btn-sm"
																onClick={() => onToggleStatus(student)}
																disabled={updating === student.id}
															>
																{updating === student.id ? 'Updating...' : 'Activate'}
															</button>
														)}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							)}
						</div>
					)}
				</main>
			</div>
		</div>
	)
}
