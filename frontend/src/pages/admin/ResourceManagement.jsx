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

	return (
		<div className="dashboard-layout">
			<Navbar />
			<div className="dashboard-container">
				<Sidebar />
				<main className="dashboard-main">
					<div className="page-header">
						<div className="page-header-content">
							<h1 className="page-title">Resource Management</h1>
							<p className="page-subtitle">Create new resources or click Edit to modify existing ones</p>
						</div>
					</div>

					{/* Create Form */}
					<div className="card">
						<div className="card-header">
							<h2 className="card-title">Add New Resource</h2>
						</div>
						<form className="resource-form" onSubmit={onCreate}>
							<input 
								className="form-input" 
								placeholder="Resource Name" 
								value={name} 
								onChange={(e) => setName(e.target.value)} 
								required 
							/>
							<input 
								className="form-input" 
								placeholder="Type (e.g., LAB, CLASSROOM)" 
								value={type} 
								onChange={(e) => setType(e.target.value)} 
								required 
							/>
							<input 
								className="form-input form-input-small" 
								type="number" 
								min={1} 
								placeholder="Capacity" 
								value={capacity} 
								onChange={(e) => setCapacity(e.target.value)} 
								required 
							/>
							<button className="btn btn-primary" type="submit">Create</button>
						</form>
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
								<h2 className="card-title">Resources ({items.length})</h2>
							</div>
							<div className="table-container">
								<table className="table">
									<thead>
										<tr>
											<th>Name</th>
											<th>Type</th>
											<th>Capacity</th>
											<th>Status</th>
											<th>Actions</th>
										</tr>
									</thead>
									<tbody>
										{items.map((r) => (
											<tr key={r.id}>
												{editingId === r.id ? (
													<>
														<td>
															<input
																className="form-input"
																value={editForm.name}
																onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
															/>
														</td>
														<td>
															<input
																className="form-input"
																value={editForm.type}
																onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
															/>
														</td>
														<td>
															<input
																className="form-input form-input-small"
																type="number"
																min={1}
																value={editForm.capacity}
																onChange={(e) => setEditForm({ ...editForm, capacity: e.target.value })}
															/>
														</td>
														<td>
															<select
																className="form-select"
																value={editForm.status}
																onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
															>
																{STATUS.map((s) => (
																	<option key={s} value={s}>{s}</option>
																))}
															</select>
														</td>
														<td>
															<div className="table-actions">
																<button
																	className="btn btn-success btn-sm"
																	onClick={onSaveEdit}
																	disabled={saving === r.id}
																>
																	{saving === r.id ? 'Saving...' : 'Save'}
																</button>
																<button
																	className="btn btn-secondary btn-sm"
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
														<td className="table-bold">{r.name}</td>
														<td className="table-muted">{r.type}</td>
														<td>{r.capacity}</td>
														<td>
															<span className={`badge badge-${r.status.toLowerCase()}`}>
																{r.status}
															</span>
														</td>
														<td>
															<div className="table-actions">
																<button
																	className="btn btn-primary btn-sm"
																	onClick={() => onEdit(r)}
																>
																	Edit
																</button>
																<button
																	className="btn btn-danger btn-sm"
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
										{items.length === 0 && (
											<tr>
												<td colSpan={5}>
													<div className="empty-state">
														<p>No resources found. Create one above.</p>
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

