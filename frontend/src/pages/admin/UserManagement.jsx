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

	const getRoleBadgeStyle = (role) => {
		switch (role) {
			case 'ADMIN':
				return { background: '#fef3c7', color: '#92400e' }
			case 'STAFF':
				return { background: '#dbeafe', color: '#1e40af' }
			case 'STUDENT':
				return { background: '#f3e8ff', color: '#7c3aed' }
			default:
				return { background: '#f3f4f6', color: '#374151' }
		}
	}

	const getStatusBadgeStyle = (status) => {
		return status === 'ACTIVE' 
			? { background: '#dcfce7', color: '#166534' }
			: { background: '#fef2f2', color: '#991b1b' }
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
		<div className="container stack">
			<Navbar />
			<div className="row" style={{ alignItems: 'flex-start' }}>
				<Sidebar />
				<div className="stack" style={{ flex: 1 }}>
					<div className="card">
						<div style={{ fontWeight: 800, fontSize: 18 }}>User Management</div>
						<div style={{ marginTop: 8, fontSize: 13, color: '#6b7280' }}>
							View all users and manage their account status
						</div>
					</div>

					{/* User Statistics */}
					<div className="card">
						<div style={{ fontWeight: 700, marginBottom: 12 }}>User Overview</div>
						<div className="row" style={{ gap: 12, flexWrap: 'wrap' }}>
							<div style={{ flex: '1 1 100px', padding: 16, background: '#f3f4f6', borderRadius: 8, textAlign: 'center' }}>
								<div style={{ fontSize: 24, fontWeight: 700 }}>{stats.total}</div>
								<div style={{ fontSize: 11, color: '#6b7280' }}>Total</div>
							</div>
							<div style={{ flex: '1 1 100px', padding: 16, background: '#dcfce7', borderRadius: 8, textAlign: 'center' }}>
								<div style={{ fontSize: 24, fontWeight: 700, color: '#166534' }}>{stats.active}</div>
								<div style={{ fontSize: 11, color: '#166534' }}>Active</div>
							</div>
							<div style={{ flex: '1 1 100px', padding: 16, background: '#fef2f2', borderRadius: 8, textAlign: 'center' }}>
								<div style={{ fontSize: 24, fontWeight: 700, color: '#991b1b' }}>{stats.inactive}</div>
								<div style={{ fontSize: 11, color: '#991b1b' }}>Inactive</div>
							</div>
							<div style={{ flex: '1 1 100px', padding: 16, background: '#f3e8ff', borderRadius: 8, textAlign: 'center' }}>
								<div style={{ fontSize: 24, fontWeight: 700, color: '#7c3aed' }}>{stats.students}</div>
								<div style={{ fontSize: 11, color: '#7c3aed' }}>Students</div>
							</div>
							<div style={{ flex: '1 1 100px', padding: 16, background: '#dbeafe', borderRadius: 8, textAlign: 'center' }}>
								<div style={{ fontSize: 24, fontWeight: 700, color: '#1e40af' }}>{stats.staff}</div>
								<div style={{ fontSize: 11, color: '#1e40af' }}>Staff</div>
							</div>
						</div>
					</div>

					{error ? <div className="error">{error}</div> : null}
					{loading ? (
						<div className="card">Loading...</div>
					) : (
						<div className="card">
							<div style={{ fontWeight: 700, marginBottom: 12 }}>All Users ({items.length})</div>
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
											<td style={{ fontWeight: 500 }}>{u.name}</td>
											<td style={{ fontSize: 13, color: '#6b7280' }}>{u.email}</td>
											<td style={{ fontSize: 13, color: '#6b7280' }}>{u.phone || '-'}</td>
											<td>
												<span className="badge" style={getRoleBadgeStyle(u.role)}>
													{u.role}
												</span>
											</td>
											<td>
												<span className="badge" style={getStatusBadgeStyle(u.status)}>
													{u.status}
												</span>
											</td>
											<td>
												{u.status === 'ACTIVE' ? (
													<button
														className="button"
														type="button"
														style={{ 
															background: '#dc2626', 
															padding: '6px 14px', 
															fontSize: 12,
															opacity: updating === u.id ? 0.6 : 1,
															cursor: updating === u.id ? 'wait' : 'pointer'
														}}
														onClick={() => onToggleStatus(u)}
														disabled={updating === u.id}
													>
														{updating === u.id ? 'Updating...' : 'Deactivate'}
													</button>
												) : (
													<button
														className="button"
														type="button"
														style={{ 
															background: '#16a34a', 
															padding: '6px 14px', 
															fontSize: 12,
															opacity: updating === u.id ? 0.6 : 1,
															cursor: updating === u.id ? 'wait' : 'pointer'
														}}
														onClick={() => onToggleStatus(u)}
														disabled={updating === u.id}
													>
														{updating === u.id ? 'Updating...' : 'Activate'}
													</button>
												)}
											</td>
										</tr>
									))}
									{items.length === 0 ? (
										<tr>
											<td colSpan={6} style={{ padding: 14, color: '#6b7280' }}>No users.</td>
										</tr>
									) : null}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

