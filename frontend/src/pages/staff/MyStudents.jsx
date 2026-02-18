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
		<div className="container stack">
			<Navbar />
			<div className="row" style={{ alignItems: 'flex-start' }}>
				<Sidebar />
				<div className="stack" style={{ flex: 1 }}>
					<div className="card">
						<div style={{ fontWeight: 800, fontSize: 18 }}>My Students</div>
						<div style={{ marginTop: 8, fontSize: 13, color: '#374151' }}>
							View and manage students assigned to you
						</div>
					</div>

					{/* Student Statistics */}
					{stats && (
						<div className="card">
							<div style={{ fontWeight: 700, marginBottom: 12 }}>Student Statistics</div>
							<div className="row" style={{ gap: 16 }}>
								<div style={{ 
									flex: 1, 
									padding: 20, 
									background: '#f3f4f6', 
									borderRadius: 8, 
									textAlign: 'center' 
								}}>
									<div style={{ fontSize: 32, fontWeight: 700, color: '#111827' }}>
										{stats.totalStudents}
									</div>
									<div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>Total Students</div>
								</div>
								<div style={{ 
									flex: 1, 
									padding: 20, 
									background: '#dcfce7', 
									borderRadius: 8, 
									textAlign: 'center' 
								}}>
									<div style={{ fontSize: 32, fontWeight: 700, color: '#166534' }}>
										{stats.activeStudents}
									</div>
									<div style={{ fontSize: 13, color: '#166534', marginTop: 4 }}>Active Students</div>
								</div>
								<div style={{ 
									flex: 1, 
									padding: 20, 
									background: '#fef2f2', 
									borderRadius: 8, 
									textAlign: 'center' 
								}}>
									<div style={{ fontSize: 32, fontWeight: 700, color: '#991b1b' }}>
										{stats.inactiveStudents}
									</div>
									<div style={{ fontSize: 13, color: '#991b1b', marginTop: 4 }}>Inactive Students</div>
								</div>
							</div>
						</div>
					)}

					{error ? <div className="error">{error}</div> : null}

					{loading ? (
						<div className="card">Loading...</div>
					) : (
						<div className="card">
							<div style={{ fontWeight: 700, marginBottom: 12 }}>Student List ({students.length})</div>
							{students.length === 0 ? (
								<div style={{ color: '#6b7280', padding: 16, textAlign: 'center' }}>
									No students assigned to you yet.
								</div>
							) : (
								<table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
									<thead>
										<tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
											<th style={{ padding: '10px 8px' }}>Name</th>
											<th style={{ padding: '10px 8px' }}>Email</th>
											<th style={{ padding: '10px 8px' }}>Phone</th>
											<th style={{ padding: '10px 8px' }}>Status</th>
											<th style={{ padding: '10px 8px' }}>Action</th>
										</tr>
									</thead>
									<tbody>
										{students.map((student) => (
											<tr key={student.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
												<td style={{ padding: '12px 8px', fontWeight: 500 }}>
													{student.name}
												</td>
												<td style={{ padding: '12px 8px', fontSize: 13, color: '#6b7280' }}>
													{student.email}
												</td>
												<td style={{ padding: '12px 8px', fontSize: 13, color: '#6b7280' }}>
													{student.phone || '-'}
												</td>
												<td style={{ padding: '12px 8px' }}>
													<span 
														className="badge"
														style={{
															background: student.status === 'ACTIVE' ? '#dcfce7' : '#fef2f2',
															color: student.status === 'ACTIVE' ? '#166534' : '#991b1b'
														}}
													>
														{student.status}
													</span>
												</td>
												<td style={{ padding: '12px 8px' }}>
													{student.status === 'ACTIVE' ? (
														<button
															className="button"
															type="button"
															style={{ 
																background: '#dc2626', 
																padding: '6px 14px', 
																fontSize: 12,
																opacity: updating === student.id ? 0.6 : 1,
																cursor: updating === student.id ? 'wait' : 'pointer'
															}}
															onClick={() => onToggleStatus(student)}
															disabled={updating === student.id}
														>
															{updating === student.id ? 'Updating...' : 'Deactivate'}
														</button>
													) : (
														<button
															className="button"
															type="button"
															style={{ 
																background: '#16a34a', 
																padding: '6px 14px', 
																fontSize: 12,
																opacity: updating === student.id ? 0.6 : 1,
																cursor: updating === student.id ? 'wait' : 'pointer'
															}}
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
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
