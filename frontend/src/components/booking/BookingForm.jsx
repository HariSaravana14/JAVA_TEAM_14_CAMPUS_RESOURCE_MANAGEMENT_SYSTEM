import { useEffect, useMemo, useState } from 'react'
import { getAvailableSlots } from '../../api/bookingApi'

export default function BookingForm({ resources, onSubmit, initialResourceId }) {
	const selectable = useMemo(() => (resources || []).filter((r) => r.status === 'AVAILABLE'), [resources])

	// Only use initialResourceId if the resource is available
	const validInitialId = useMemo(() => {
		if (!initialResourceId) return ''
		const resource = selectable.find((r) => r.id === initialResourceId)
		return resource ? initialResourceId : ''
	}, [initialResourceId, selectable])

	const [resourceId, setResourceId] = useState(validInitialId)
	const [bookingDate, setBookingDate] = useState('')
	const [slots, setSlots] = useState([])
	const [selectedSlot, setSelectedSlot] = useState(null)
	const [slotsLoading, setSlotsLoading] = useState(false)
	const [submitting, setSubmitting] = useState(false)
	const [error, setError] = useState('')

	// Sync resourceId when initialResourceId changes (e.g., clicking Book on a card)
	useEffect(() => {
		if (validInitialId) {
			setResourceId(validInitialId)
		}
	}, [validInitialId])

	// Fetch slots when resource and date are selected
	useEffect(() => {
		if (!resourceId || !bookingDate) {
			setSlots([])
			setSelectedSlot(null)
			return
		}

		let cancelled = false
		setSlotsLoading(true)
		setError('')
		setSelectedSlot(null)

		getAvailableSlots(resourceId, bookingDate)
			.then((data) => {
				if (!cancelled) {
					setSlots(data || [])
				}
			})
			.catch((err) => {
				if (!cancelled) {
					setError(err?.response?.data?.message || 'Failed to load slots')
					setSlots([])
				}
			})
			.finally(() => {
				if (!cancelled) {
					setSlotsLoading(false)
				}
			})

		return () => {
			cancelled = true
		}
	}, [resourceId, bookingDate])

	const handleSlotClick = (slot) => {
		if (!slot.available) return
		setSelectedSlot(slot)
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError('')

		if (!resourceId || !bookingDate || !selectedSlot) {
			setError('Please select a resource, date, and time slot')
			return
		}

		setSubmitting(true)
		try {
			await onSubmit({
				resourceId,
				bookingDate,
				startTime: selectedSlot.startTime,
				endTime: selectedSlot.endTime
			})
			setBookingDate('')
			setSelectedSlot(null)
			setSlots([])
		} catch (err) {
			setError(err?.response?.data?.message || err?.message || 'Failed to create booking')
		} finally {
			setSubmitting(false)
		}
	}

	// Get today's date in YYYY-MM-DD format
	const today = new Date().toISOString().split('T')[0]

	return (
		<form className="card stack" onSubmit={handleSubmit}>
			<div style={{ fontWeight: 700 }}>Create Booking</div>

			<label className="stack" style={{ gap: 6 }}>
				<div style={{ fontSize: 13, color: '#374151' }}>Resource</div>
				<select className="input" value={resourceId} onChange={(e) => setResourceId(e.target.value)}>
					<option value="">Select a resource</option>
					{selectable.map((r) => (
						<option key={r.id} value={r.id}>
							{r.name} ({r.type})
						</option>
					))}
				</select>
			</label>

			<label className="stack" style={{ gap: 6 }}>
				<div style={{ fontSize: 13, color: '#374151' }}>Date</div>
				<input
					className="input"
					type="date"
					value={bookingDate}
					min={today}
					onChange={(e) => setBookingDate(e.target.value)}
				/>
			</label>

			{/* Time Slots */}
			{resourceId && bookingDate && (
				<div className="stack" style={{ gap: 8 }}>
					<div style={{ fontSize: 13, color: '#374151' }}>
						Available Time Slots
						<span style={{ fontSize: 11, color: '#6b7280', marginLeft: 8 }}>
							(9 AM - 4 PM, Lunch: 12:30 - 1:30 PM blocked)
						</span>
					</div>

					{slotsLoading ? (
						<div style={{ padding: 16, textAlign: 'center', color: '#6b7280' }}>Loading slots...</div>
					) : slots.length === 0 ? (
						<div style={{ padding: 16, textAlign: 'center', color: '#6b7280' }}>No slots available</div>
					) : (
						<div
							style={{
								display: 'grid',
								gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
								gap: 8
							}}
						>
							{slots.map((slot, idx) => {
								const isSelected = selectedSlot?.startTime === slot.startTime
								return (
									<button
										key={idx}
										type="button"
										onClick={() => handleSlotClick(slot)}
										disabled={!slot.available}
										style={{
											padding: '12px 8px',
											borderRadius: 8,
											border: isSelected ? '2px solid #2563eb' : '1px solid #e5e7eb',
											background: !slot.available
												? '#f3f4f6'
												: isSelected
													? '#dbeafe'
													: '#ffffff',
											color: !slot.available ? '#9ca3af' : '#1f2937',
											cursor: slot.available ? 'pointer' : 'not-allowed',
											fontWeight: isSelected ? 600 : 400,
											fontSize: 13,
											transition: 'all 0.15s ease'
										}}
									>
										{slot.label}
										{!slot.available && (
											<div style={{ fontSize: 10, color: '#ef4444', marginTop: 2 }}>Booked</div>
										)}
									</button>
								)
							})}
						</div>
					)}
				</div>
			)}

			{selectedSlot && (
				<div
					style={{
						padding: 12,
						background: '#f0fdf4',
						borderRadius: 8,
						fontSize: 13,
						color: '#166534'
					}}
				>
					Selected: <strong>{selectedSlot.label}</strong>
				</div>
			)}

			{error ? <div className="error">{error}</div> : null}

			<button className="button" type="submit" disabled={submitting || !selectedSlot}>
				{submitting ? 'Creating...' : 'Create Booking'}
			</button>
		</form>
	)
}

