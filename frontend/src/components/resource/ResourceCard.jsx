export default function ResourceCard({ resource, onSelect }) {
	if (!resource) return null

	const isAvailable = resource.status === 'AVAILABLE'

	const getStatusStyle = () => {
		switch (resource.status) {
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
		<div 
			className="card" 
			style={{ 
				minWidth: 260, 
				flex: '1 1 260px',
				opacity: isAvailable ? 1 : 0.6
			}}
		>
			<div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
				<div style={{ fontWeight: 700 }}>{resource.name}</div>
				<span className="badge" style={getStatusStyle()}>{resource.status}</span>
			</div>
			<div style={{ fontSize: 13, color: '#374151', marginTop: 6 }}>
				Type: {resource.type}
			</div>
			<div style={{ fontSize: 13, color: '#374151', marginTop: 6 }}>
				Capacity: {resource.capacity}
			</div>

			{onSelect && isAvailable && (
				<div style={{ marginTop: 12 }}>
					<button className="button" type="button" onClick={() => onSelect(resource)}>
						Book
					</button>
				</div>
			)}
			{!isAvailable && (
				<div style={{ marginTop: 12, fontSize: 12, color: '#991b1b' }}>
					This resource is not available for booking
				</div>
			)}
		</div>
	)
}

