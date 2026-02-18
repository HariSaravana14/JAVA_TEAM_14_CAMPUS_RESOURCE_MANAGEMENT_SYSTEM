import { useEffect, useState } from 'react'
import Navbar from '../../components/layout/Navbar'
import Sidebar from '../../components/layout/Sidebar'
import {
	createResource,
	deleteResource,
	listResources,
	updateResource,
} from '../../api/resourceApi'
import { extractErrorMessage } from '../../api/axiosInstance'

const STATUS = ['AVAILABLE', 'MAINTENANCE', 'INACTIVE']

export default function ResourceManagement() {
	const [items, setItems] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [saving, setSaving] = useState(null)

	// Create form state
	const [name, setName] = useState('')
	const [type, setType] = useState('')
	const [capacity, setCapacity] = useState(1)

	// Edit mode state
	const [editingId, setEditingId] = useState(null)
	const [editForm, setEditForm] = useState({ name: '', type: '', capacity: 1, status: 'AVAILABLE' })

	const load = async () => {
		setLoading(true)
		setError('')
		try {
			setItems(await listResources())
		} catch (err) {
			setError(extractErrorMessage(err))
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		load()
	}, [])

	const onCreate = async (e) => {
		e.preventDefault()
		setError('')
		try {
			await createResource({ name, type, capacity: Number(capacity) })
			setName('')
			setType('')
			setCapacity(1)
			await load()
		} catch (err) {
			setError(extractErrorMessage(err))
		}
	}

	const onEdit = (resource) => {
		setEditingId(resource.id)
		setEditForm({
			name: resource.name,
			type: resource.type,
			capacity: resource.capacity,
			status: resource.status
		})
	}

	const onCancelEdit = () => {
		setEditingId(null)
		setEditForm({ name: '', type: '', capacity: 1, status: 'AVAILABLE' })
	}

	const onSaveEdit = async () => {
		if (!editForm.name.trim() || !editForm.type.trim()) {
			setError('Name and Type are required')
			return
		}
		setSaving(editingId)
		setError('')
		try {
			await updateResource(editingId, {
				name: editForm.name.trim(),
				type: editForm.type.trim(),
				capacity: Number(editForm.capacity),
				status: editForm.status
			})
			setEditingId(null)
			await load()
		} catch (err) {
			setError(extractErrorMessage(err))
		} finally {
			setSaving(null)
		}
	}

	const onDelete = async (id, name) => {
		if (!window.confirm(`Are you sure you want to permanently delete "${name}"?\n\nThis will remove the resource from the database and cannot be undone.`)) {
			return
		}
		setError('')
		try {
			await deleteResource(id)
			await load()
		} catch (err) {
			setError(extractErrorMessage(err))
		}
	}

	const getStatusBadgeStyle = (status) => {
		switch (status) {
			case 'AVAILABLE':
				return { background: '#dcfce7', color: '#166534' }
			case 'MAINTENANCE':
				return { background: '#fef3c7', color: '#92400e' }
			case 'INACTIVE':
				return { background: '#fef2f2', color: '#991b1b' }
			default:
				return { background: '#f3f4f6', color: '#374151' }
		}
	}

	return (
		<div className="container stack">
			<Navbar />
			<div className="row" style={{ alignItems: 'flex-start' }}>
				<Sidebar />
				<div className="stack" style={{ flex: 1 }}>
					<div className="card">
						<div style={{ fontWeight: 800, fontSize: 18 }}>Resource Management</div>
						<div style={{ marginTop: 4, fontSize: 13, color: '#6b7280' }}>
							Create new resources or click Edit to modify existing ones
						</div>
						<form className="row" style={{ marginTop: 12 }} onSubmit={onCreate}>
							<input className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} style={{ flex: '1 1 220px' }} required />
							<input className="input" placeholder="Type (e.g., LAB, CLASSROOM)" value={type} onChange={(e) => setType(e.target.value)} style={{ flex: '1 1 160px' }} required />
							<input className="input" type="number" min={1} placeholder="Capacity" value={capacity} onChange={(e) => setCapacity(e.target.value)} style={{ width: 140 }} required />
							<button className="button" type="submit">Create</button>
						</form>
					</div>

					{error ? <div className="error">{error}</div> : null}
					{loading ? (
						<div className="card">Loading...</div>
					) : (
						<div className="card">
							<div style={{ fontWeight: 700, marginBottom: 12 }}>Resources ({items.length})</div>
							<table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
								<thead>
									<tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
										<th style={{ padding: '10px 8px' }}>Name</th>
										<th style={{ padding: '10px 8px' }}>Type</th>
										<th style={{ padding: '10px 8px' }}>Capacity</th>
										<th style={{ padding: '10px 8px' }}>Status</th>
										<th style={{ padding: '10px 8px' }}>Actions</th>
									</tr>
								</thead>
								<tbody>
									{items.map((r) => (
										<tr key={r.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
											{editingId === r.id ? (
												<>
													<td style={{ padding: '8px' }}>
														<input
															className="input"
															value={editForm.name}
															onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
															style={{ width: '100%' }}
														/>
													</td>
													<td style={{ padding: '8px' }}>
														<input
															className="input"
															value={editForm.type}
															onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
															style={{ width: '100%' }}
														/>
													</td>
													<td style={{ padding: '8px' }}>
														<input
															className="input"
															type="number"
															min={1}
															value={editForm.capacity}
															onChange={(e) => setEditForm({ ...editForm, capacity: e.target.value })}
															style={{ width: 100 }}
														/>
													</td>
													<td style={{ padding: '8px' }}>
														<select
															className="input"
															value={editForm.status}
															onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
															style={{ padding: '6px 10px' }}
														>
															{STATUS.map((s) => (
																<option key={s} value={s}>{s}</option>
															))}
														</select>
													</td>
													<td style={{ padding: '8px' }}>
														<div className="row" style={{ gap: 6 }}>
															<button
																className="button"
																type="button"
																style={{ 
																	background: '#16a34a', 
																	padding: '6px 12px', 
																	fontSize: 12,
																	opacity: saving === r.id ? 0.6 : 1
																}}
																onClick={onSaveEdit}
																disabled={saving === r.id}
															>
																{saving === r.id ? 'Saving...' : 'Save'}
															</button>
															<button
																className="button"
																type="button"
																style={{ background: '#6b7280', padding: '6px 12px', fontSize: 12 }}
																onClick={onCancelEdit}
																disabled={saving === r.id}
															>
																Cancel
															</button>
														</div>
													</td>
												</>
											) : (
												<>
													<td style={{ padding: '12px 8px', fontWeight: 500 }}>
														{r.name}
													</td>
													<td style={{ padding: '12px 8px', color: '#6b7280' }}>
														{r.type}
													</td>
													<td style={{ padding: '12px 8px' }}>
														{r.capacity}
													</td>
													<td style={{ padding: '12px 8px' }}>
														<span 
															className="badge"
															style={getStatusBadgeStyle(r.status)}
														>
															{r.status}
														</span>
													</td>
													<td style={{ padding: '12px 8px' }}>
														<div className="row" style={{ gap: 6 }}>
															<button
																className="button"
																type="button"
																style={{ background: '#2563eb', padding: '6px 12px', fontSize: 12 }}
																onClick={() => onEdit(r)}
															>
																Edit
															</button>
															<button
																className="button"
																type="button"
																style={{ background: '#dc2626', padding: '6px 12px', fontSize: 12 }}
																onClick={() => onDelete(r.id, r.name)}
															>
																Delete
															</button>
														</div>
													</td>
												</>
											)}
										</tr>
									))}
									{items.length === 0 ? (
										<tr>
											<td colSpan={5} style={{ padding: 14, color: '#6b7280', textAlign: 'center' }}>
												No resources found. Create one above.
											</td>
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

