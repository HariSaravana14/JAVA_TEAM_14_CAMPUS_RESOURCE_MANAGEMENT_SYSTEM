import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { extractErrorMessage } from '../../api/axiosInstance'
import { useAuth } from '../../hooks/useAuth'
import { getAdvisors } from '../../api/authApi'

const ROLE_CONFIG = {
	student: { role: 'STUDENT', title: 'Student Registration', className: 'student', redirect: '/student' },
	staff: { role: 'STAFF', title: 'Staff Registration', className: 'staff', redirect: '/staff' },
}

export default function Register() {
	const { portal } = useParams()
	const config = ROLE_CONFIG[portal] || ROLE_CONFIG.student
	const { register } = useAuth()
	const navigate = useNavigate()

	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [phone, setPhone] = useState('')
	const [password, setPassword] = useState('')
	const [advisorId, setAdvisorId] = useState('')
	const [advisors, setAdvisors] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	useEffect(() => {
		if (config.role === 'STUDENT') {
			getAdvisors()
				.then(setAdvisors)
				.catch(() => setAdvisors([]))
		}
	}, [config.role])

	const onSubmit = async (e) => {
		e.preventDefault()
		setError('')

		if (config.role === 'STUDENT' && !advisorId) {
			setError('Please select your class advisor')
			return
		}

		setLoading(true)
		try {
			const payload = {
				name,
				email,
				phone: phone || null,
				password,
				role: config.role,
				advisorId: config.role === 'STUDENT' ? advisorId : null,
			}
			await register(payload)
			navigate(config.redirect, { replace: true })
		} catch (err) {
			setError(extractErrorMessage(err))
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="auth-container">
			<div className="auth-card">
				<div className="auth-role-indicator">
					<div className={`auth-role-bar auth-role-bar-${config.className}`} />
					<h1 className="auth-role-title">{config.title}</h1>
				</div>

				<form className="auth-form" onSubmit={onSubmit}>
					<div className="auth-form-group">
						<label className="auth-label">Name</label>
						<input 
							className="auth-input" 
							value={name} 
							onChange={(e) => setName(e.target.value)} 
							placeholder="Enter your full name"
							required 
						/>
					</div>

					<div className="auth-form-group">
						<label className="auth-label">Email</label>
						<input 
							className="auth-input" 
							type="email" 
							value={email} 
							onChange={(e) => setEmail(e.target.value)} 
							placeholder="Enter your email"
							required 
						/>
					</div>

					<div className="auth-form-group">
						<label className="auth-label">Phone</label>
						<input 
							className="auth-input" 
							value={phone} 
							onChange={(e) => setPhone(e.target.value)} 
							placeholder="Required for password recovery" 
						/>
					</div>

					<div className="auth-form-group">
						<label className="auth-label">Password</label>
						<input 
							className="auth-input" 
							type="password" 
							value={password} 
							onChange={(e) => setPassword(e.target.value)} 
							placeholder="Minimum 8 characters"
							required 
							minLength={8} 
						/>
					</div>

					{config.role === 'STUDENT' && (
						<div className="auth-form-group">
							<label className="auth-label">
								Class Advisor <span className="auth-required">*</span>
							</label>
							<select
								className="auth-select"
								value={advisorId}
								onChange={(e) => setAdvisorId(e.target.value)}
								required
							>
								<option value="">-- Select your class advisor --</option>
								{advisors.map((a) => (
									<option key={a.id} value={a.id}>
										{a.name} ({a.email})
									</option>
								))}
							</select>
							{advisors.length === 0 && (
								<span className="auth-hint">No advisors available. Please contact admin.</span>
							)}
						</div>
					)}

					{error && <div className="auth-error">{error}</div>}

					<button 
						className={`auth-button auth-button-${config.className}`} 
						type="submit" 
						disabled={loading}
					>
						{loading ? 'Creating...' : 'Create account'}
					</button>
				</form>

				<div className="divider-text">
					<span>or</span>
				</div>

				<button 
					type="button" 
					className="auth-social-button"
					onClick={() => alert('Google Sign-Up requires OAuth setup. Please configure Google Cloud Console credentials.')}
				>
					<svg width="18" height="18" viewBox="0 0 24 24">
						<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
						<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
						<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
						<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
					</svg>
					Continue with Google
				</button>

				<div className="auth-footer">
					<div className="auth-footer-text">
						Already have an account? <Link to={`/login/${portal || 'student'}`} className="auth-footer-link">Login</Link>
					</div>
					<Link to="/" className="auth-back-link">
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<path d="M19 12H5M12 19l-7-7 7-7"/>
						</svg>
						Back to portal selection
					</Link>
				</div>
			</div>
		</div>
	)
}

