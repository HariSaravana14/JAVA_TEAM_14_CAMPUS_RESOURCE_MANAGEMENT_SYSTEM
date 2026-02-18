import { useMemo } from 'react'

const APPROVAL_STAGES = [
	{ key: 'CREATED', label: 'Created' },
	{ key: 'PENDING_STAFF', label: 'Staff Review' },
	{ key: 'PENDING_ADMIN', label: 'Admin Review' },
	{ key: 'APPROVED', label: 'Approved' }
]

const STAFF_APPROVAL_STAGES = [
	{ key: 'CREATED', label: 'Created' },
	{ key: 'PENDING_ADMIN', label: 'Admin Review' },
	{ key: 'APPROVED', label: 'Approved' }
]

export default function ApprovalStatusTracker({ stage, isStaffBooking = false }) {
	const stages = isStaffBooking ? STAFF_APPROVAL_STAGES : APPROVAL_STAGES
	
	const { currentIndex, isRejected, isCancelled } = useMemo(() => {
		if (stage === 'REJECTED') {
			return { currentIndex: -1, isRejected: true, isCancelled: false }
		}
		if (stage === 'CANCELLED') {
			return { currentIndex: -1, isRejected: false, isCancelled: true }
		}
		
		// Map stages to index
		const stageMap = {
			'PENDING_STAFF': 1,
			'PENDING_ADMIN': isStaffBooking ? 1 : 2,
			'APPROVED': isStaffBooking ? 2 : 3,
			'APPROVED_STAFF_ONLY': isStaffBooking ? 2 : 3
		}
		
		return { 
			currentIndex: stageMap[stage] ?? 0, 
			isRejected: false, 
			isCancelled: false 
		}
	}, [stage, isStaffBooking])

	if (isRejected) {
		return (
			<div style={{ padding: 16 }}>
				<div style={{ 
					display: 'flex', 
					alignItems: 'center', 
					gap: 8,
					padding: '12px 16px',
					background: '#fef2f2',
					borderRadius: 8,
					border: '1px solid #fecaca'
				}}>
					<div style={{
						width: 24,
						height: 24,
						borderRadius: '50%',
						background: '#dc2626',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						color: 'white',
						fontSize: 14,
						fontWeight: 700
					}}>✕</div>
					<span style={{ color: '#991b1b', fontWeight: 600 }}>Booking Rejected</span>
				</div>
			</div>
		)
	}

	if (isCancelled) {
		return (
			<div style={{ padding: 16 }}>
				<div style={{ 
					display: 'flex', 
					alignItems: 'center', 
					gap: 8,
					padding: '12px 16px',
					background: '#f3f4f6',
					borderRadius: 8,
					border: '1px solid #e5e7eb'
				}}>
					<div style={{
						width: 24,
						height: 24,
						borderRadius: '50%',
						background: '#6b7280',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						color: 'white',
						fontSize: 14,
						fontWeight: 700
					}}>−</div>
					<span style={{ color: '#6b7280', fontWeight: 600 }}>Booking Cancelled</span>
				</div>
			</div>
		)
	}

	return (
		<div style={{ padding: '16px 8px' }}>
			<div style={{ 
				display: 'flex', 
				alignItems: 'center', 
				justifyContent: 'space-between',
				position: 'relative'
			}}>
				{/* Progress Line Background */}
				<div style={{
					position: 'absolute',
					top: '50%',
					left: '10%',
					right: '10%',
					height: 3,
					background: '#e5e7eb',
					transform: 'translateY(-50%)',
					zIndex: 0
				}} />
				
				{/* Progress Line Filled */}
				<div style={{
					position: 'absolute',
					top: '50%',
					left: '10%',
					width: `${Math.max(0, (currentIndex / (stages.length - 1)) * 80)}%`,
					height: 3,
					background: '#16a34a',
					transform: 'translateY(-50%)',
					zIndex: 1,
					transition: 'width 0.3s ease'
				}} />

				{stages.map((s, idx) => {
					const isCompleted = idx < currentIndex
					const isCurrent = idx === currentIndex
					const isPending = idx > currentIndex

					return (
						<div 
							key={s.key} 
							style={{ 
								display: 'flex', 
								flexDirection: 'column', 
								alignItems: 'center',
								zIndex: 2,
								flex: 1
							}}
						>
							{/* Circle */}
							<div style={{
								width: isCurrent ? 36 : 28,
								height: isCurrent ? 36 : 28,
								borderRadius: '50%',
								background: isCompleted ? '#16a34a' : isCurrent ? '#2563eb' : '#e5e7eb',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								color: isCompleted || isCurrent ? 'white' : '#9ca3af',
								fontSize: isCurrent ? 16 : 12,
								fontWeight: 600,
								border: isCurrent ? '3px solid #93c5fd' : 'none',
								boxShadow: isCurrent ? '0 0 0 4px rgba(37, 99, 235, 0.2)' : 'none',
								transition: 'all 0.3s ease'
							}}>
								{isCompleted ? '✓' : idx + 1}
							</div>
							
							{/* Label */}
							<div style={{
								marginTop: 8,
								fontSize: 11,
								fontWeight: isCurrent ? 600 : 400,
								color: isCompleted ? '#16a34a' : isCurrent ? '#2563eb' : '#9ca3af',
								textAlign: 'center',
								maxWidth: 80
							}}>
								{s.label}
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}
