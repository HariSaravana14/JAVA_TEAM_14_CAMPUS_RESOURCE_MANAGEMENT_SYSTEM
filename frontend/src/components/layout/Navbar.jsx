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

export default function Navbar({ onMenuToggle }) {
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

	const getRoleClass = () => {
		switch (user?.role) {
			case 'STUDENT': return 'navbar-role-student'
			case 'STAFF': return 'navbar-role-staff'
			case 'ADMIN': return 'navbar-role-admin'
			default: return ''
		}
	}

	return (
		<nav className="navbar">
			{onMenuToggle && (
				<button className="hamburger-btn" type="button" onClick={onMenuToggle} aria-label="Toggle menu">
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
						<line x1="3" y1="6" x2="21" y2="6" />
						<line x1="3" y1="12" x2="21" y2="12" />
						<line x1="3" y1="18" x2="21" y2="18" />
					</svg>
				</button>
			)}
			<div className="navbar-brand">
				<div className="navbar-logo">CR</div>
				<span>Campus Resource Booking</span>
			</div>
			<div className="navbar-actions">
				{expiresAt && timeLeft > 0 && (
					<div className={`session-timer ${isLowTime ? 'session-timer-warning' : ''}`}>
						<span className="session-timer-label">Session:</span>
						<span className="session-timer-value">{formatTime(timeLeft)}</span>
					</div>
				)}
				<div className="navbar-user">
					<span className={`navbar-role ${getRoleClass()}`}>{user?.role}</span>
					<span className="navbar-user-email">{user?.email}</span>
				</div>
				<button className="navbar-logout" onClick={onLogout} type="button">
					Logout
				</button>
			</div>
		</nav>
	)
}

