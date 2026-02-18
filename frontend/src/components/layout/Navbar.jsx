import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function formatTime(ms) {
	if (ms <= 0) return '0:00'
	const totalSeconds = Math.floor(ms / 1000)
	const hours = Math.floor(totalSeconds / 3600)
	const minutes = Math.floor((totalSeconds % 3600) / 60)
	const seconds = totalSeconds % 60

	if (hours > 0) {
		return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
	}
	return `${minutes}:${String(seconds).padStart(2, '0')}`
}

export default function Navbar() {
	const { user, expiresAt, logout } = useAuth()
	const navigate = useNavigate()
	const [timeLeft, setTimeLeft] = useState(expiresAt ? expiresAt - Date.now() : 0)

	useEffect(() => {
		if (!expiresAt) return

		const update = () => {
			const remaining = expiresAt - Date.now()
			setTimeLeft(remaining > 0 ? remaining : 0)
		}

		update()
		const interval = setInterval(update, 1000)
		return () => clearInterval(interval)
	}, [expiresAt])

	const onLogout = () => {
		logout()
		navigate('/login', { replace: true })
	}

	const isLowTime = timeLeft > 0 && timeLeft < 60000 // Less than 1 minute

	return (
		<div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
			<div style={{ fontWeight: 700 }}>Campus Resource Booking</div>
			<div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
				{expiresAt && timeLeft > 0 && (
					<div 
						style={{ 
							display: 'flex', 
							alignItems: 'center', 
							gap: 6,
							padding: '4px 10px',
							borderRadius: 6,
							background: isLowTime ? '#fef2f2' : '#f3f4f6',
							border: isLowTime ? '1px solid #fecaca' : '1px solid #e5e7eb',
							fontSize: 13,
							fontWeight: 500,
							color: isLowTime ? '#dc2626' : '#374151'
						}}
					>
						<span style={{ fontSize: 11, color: isLowTime ? '#dc2626' : '#6b7280' }}>Session:</span>
						<span style={{ fontFamily: 'monospace' }}>{formatTime(timeLeft)}</span>
					</div>
				)}
				<span className="badge">{user?.role}</span>
				<span style={{ fontSize: 13, color: '#374151' }}>{user?.email}</span>
				<button className="button secondary" onClick={onLogout} type="button">
					Logout
				</button>
			</div>
		</div>
	)
}

