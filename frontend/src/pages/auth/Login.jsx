import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { extractErrorMessage } from '../../api/axiosInstance'
import { useAuth } from '../../hooks/useAuth'

const ROLE_CONFIG = {
	student: { role: 'STUDENT', title: 'Student Login', color: '#2563eb', redirect: '/student' },
	staff: { role: 'STAFF', title: 'Staff Login', color: '#059669', redirect: '/staff' },
	admin: { role: 'ADMIN', title: 'Admin Login', color: '#dc2626', redirect: '/admin' },
}

export default function Login() {
	const { portal } = useParams()
	const config = ROLE_CONFIG[portal] || ROLE_CONFIG.student
	const { login } = useAuth()
	const navigate = useNavigate()

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	const onSubmit = async (e) => {
		e.preventDefault()
		setError('')
		setLoading(true)
		try {
			await login({ email, password, expectedRole: config.role })
			navigate(config.redirect, { replace: true })
		} catch (err) {
			setError(extractErrorMessage(err))
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="container" style={{ maxWidth: 520 }}>
			<div className="card stack">
				<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
					<div style={{ 
						width: 8, 
						height: 32, 
						backgroundColor: config.color, 
						borderRadius: 4 
					}} />
					<div style={{ fontWeight: 800, fontSize: 20 }}>{config.title}</div>
				</div>

				<form className="stack" onSubmit={onSubmit}>
					<label className="stack" style={{ gap: 6 }}>
						<div style={{ fontSize: 13, color: '#374151' }}>Email</div>
						<input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
					</label>

					<label className="stack" style={{ gap: 6 }}>
						<div style={{ fontSize: 13, color: '#374151' }}>Password</div>
						<input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
					</label>

					{error ? <div className="error">{error}</div> : null}

					<button className="button" type="submit" disabled={loading} style={{ backgroundColor: config.color }}>
						{loading ? 'Signing in...' : 'Login'}
					</button>
				</form>

				<div style={{ position: 'relative', textAlign: 'center', margin: '8px 0' }}>
					<div style={{ borderTop: '1px solid #e5e7eb', position: 'absolute', top: '50%', left: 0, right: 0 }} />
					<span style={{ backgroundColor: '#fff', padding: '0 12px', position: 'relative', fontSize: 12, color: '#9ca3af' }}>or</span>
				</div>

				<button 
					type="button" 
					className="button" 
					style={{ 
						backgroundColor: '#fff', 
						color: '#374151', 
						border: '1px solid #e5e7eb',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						gap: 10
					}}
					onClick={() => alert('Google Sign-In requires OAuth setup. Please configure Google Cloud Console credentials.')}
				>
					<svg width="18" height="18" viewBox="0 0 24 24">
						<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
						<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
						<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
						<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
					</svg>
					Sign in with Google
				</button>

				<div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#374151' }}>
					{portal !== 'admin' && (
						<span>No account? <Link to={`/register/${portal || 'student'}`} style={{ textDecoration: 'underline' }}>Register</Link></span>
					)}
					{portal === 'admin' && <span />}
					<Link to="/forgot-password" style={{ textDecoration: 'underline', color: '#2563eb' }}>Forgot Password?</Link>
				</div>

				<div style={{ textAlign: 'center', marginTop: 8 }}>
					<Link to="/" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'underline' }}>← Back to portal selection</Link>
				</div>
			</div>
		</div>
	)
}

