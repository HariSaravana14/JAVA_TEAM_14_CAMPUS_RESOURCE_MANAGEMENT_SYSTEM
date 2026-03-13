import { useEffect, useState } from 'react'
import Navbar from '../../components/layout/Navbar'
import Sidebar from '../../components/layout/Sidebar'
import { listUsers, updateUser } from '../../api/userApi'
import { extractErrorMessage } from '../../api/axiosInstance'

export default function UserManagement() {
	const [items, setItems] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [updating, setUpdating] = useState(null)
	const [sidebarOpen, setSidebarOpen] = useState(false)

	const load = async () => {
		setLoading(true)
		setError('')
		try {
			setItems(await listUsers())
		} catch (err) {
			setError(extractErrorMessage(err))
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		load()
	}, [])

	const onToggleStatus = async (user) => {
		const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
		const action = newStatus === 'ACTIVE' ? 'activate' : 'deactivate'
		
		if (!window.confirm(`Are you sure you want to ${action} "${user.name}"?`)) {
			return
		}
		
		setUpdating(user.id)
		setError('')
		try {
			await updateUser(user.id, { status: newStatus })
			await load()
		} catch (err) {
			setError(extractErrorMessage(err))
		} finally {
			setUpdating(null)
		}
	}

	// Calculate stats
	const stats = {
		total: items.length,
		active: items.filter(u => u.status === 'ACTIVE').length,
		inactive: items.filter(u => u.status === 'INACTIVE').length,
		students: items.filter(u => u.role === 'STUDENT').length,
		staff: items.filter(u => u.role === 'STAFF').length,
		admins: items.filter(u => u.role === 'ADMIN').length
	}

	return (
		<div className="dashboard-layout">
			<Navbar onMenuToggle={() => setSidebarOpen((v) => !v)} />
			<div className="dashboard-container">
				<Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
				<main className="dashboard-main">
					<div className="page-header">
						<div className="page-header-content">
							<h1 className="page-title">User Management</h1>
							<p className="page-subtitle">View all users and manage their account status</p>
						</div>
					</div>

					{/* User Statistics */}
					<div className="stats-grid stats-grid-5">
						<div className="stat-card stat-card-default">
							<div className="stat-number">{stats.total}</div>
							<div className="stat-label">Total Users</div>
						</div>
						<div className="stat-card stat-card-success">
							<div className="stat-number">{stats.active}</div>
							<div className="stat-label">Active</div>
						</div>
						<div className="stat-card stat-card-danger">
							<div className="stat-number">{stats.inactive}</div>
							<div className="stat-label">Inactive</div>
						</div>
						<div className="stat-card stat-card-purple">
							<div className="stat-number">{stats.students}</div>
							<div className="stat-label">Students</div>
						</div>
						<div className="stat-card stat-card-info">
							<div className="stat-number">{stats.staff}</div>
							<div className="stat-label">Staff</div>
						</div>
					</div>

					{error && <div className="alert alert-error">{error}</div>}
					
					{loading ? (
						<div className="card loading-card">
							<div className="loading-spinner"></div>
							<span>Loading...</span>
						</div>
					) : (
						<div className="card">
							<div className="card-header">
								<h2 className="card-title">All Users ({items.length})</h2>
							</div>
							<div className="table-container">
								<table className="table">
									<thead>
										<tr>
											<th>Name</th>
											<th>Email</th>
											<th>Phone</th>
											<th>Role</th>
											<th>Status</th>
											<th>Action</th>
										</tr>
									</thead>
									<tbody>
										{items.map((u) => (
											<tr key={u.id}>
												<td className="table-bold">{u.name}</td>
												<td className="table-muted">{u.email}</td>
												<td className="table-muted">{u.phone || '-'}</td>
												<td>
													<span className={`badge badge-${u.role.toLowerCase()}`}>
														{u.role}
													</span>
												</td>
												<td>
													<span className={`badge badge-${u.status.toLowerCase()}`}>
														{u.status}
													</span>
												</td>
												<td>
													{u.status === 'ACTIVE' ? (
														<button
															className="btn btn-danger btn-sm"
															onClick={() => onToggleStatus(u)}
															disabled={updating === u.id}
														>
															{updating === u.id ? 'Updating...' : 'Deactivate'}
														</button>
													) : (
														<button
															className="btn btn-success btn-sm"
															onClick={() => onToggleStatus(u)}
															disabled={updating === u.id}
														>
															{updating === u.id ? 'Updating...' : 'Activate'}
														</button>
													)}
												</td>
											</tr>
										))}
										{items.length === 0 && (
											<tr>
												<td colSpan={6}>
													<div className="empty-state">
														<p>No users found.</p>
													</div>
												</td>
											</tr>
										)}
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

