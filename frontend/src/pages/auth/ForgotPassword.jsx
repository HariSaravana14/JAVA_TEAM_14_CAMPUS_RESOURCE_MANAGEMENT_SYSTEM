import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { extractErrorMessage } from '../../api/axiosInstance'
import { sendOtp, verifyOtp, resetPassword } from '../../api/authApi'

const STEPS = { PHONE: 1, OTP: 2, NEW_PASSWORD: 3, SUCCESS: 4 }

export default function ForgotPassword() {
	const navigate = useNavigate()
	const [step, setStep] = useState(STEPS.PHONE)
	const [phone, setPhone] = useState('')
	const [otp, setOtp] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [message, setMessage] = useState('')

	const handleSendOtp = async (e) => {
		e.preventDefault()
		setError('')
		setLoading(true)
		try {
			const res = await sendOtp({ phone })
			setMessage(res.message || 'OTP sent successfully')
			setStep(STEPS.OTP)
		} catch (err) {
			setError(extractErrorMessage(err))
		} finally {
			setLoading(false)
		}
	}

	const handleVerifyOtp = async (e) => {
		e.preventDefault()
		setError('')
		setLoading(true)
		try {
			const res = await verifyOtp({ phone, otp })
			setMessage(res.message || 'OTP verified successfully')
			setStep(STEPS.NEW_PASSWORD)
		} catch (err) {
			setError(extractErrorMessage(err))
		} finally {
			setLoading(false)
		}
	}

	const handleResetPassword = async (e) => {
		e.preventDefault()
		setError('')

		if (newPassword.length < 8) {
			setError('Password must be at least 8 characters')
			return
		}
		if (newPassword !== confirmPassword) {
			setError('Passwords do not match')
			return
		}

		setLoading(true)
		try {
			const res = await resetPassword({ phone, otp, newPassword })
			setMessage(res.message || 'Password reset successfully')
			setStep(STEPS.SUCCESS)
		} catch (err) {
			setError(extractErrorMessage(err))
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="auth-container">
			<div className="auth-card">
				<h1 className="auth-title">Forgot Password</h1>

				{/* Progress indicator */}
				<div className="auth-progress">
					{[1, 2, 3].map((s) => (
						<div
							key={s}
							className={`auth-progress-step ${step >= s ? 'auth-progress-step-active' : ''}`}
						/>
					))}
				</div>

				{step === STEPS.PHONE && (
					<form className="auth-form" onSubmit={handleSendOtp}>
						<p className="auth-description">
							Enter your registered mobile number to receive an OTP
						</p>
						<div className="auth-form-group">
							<label className="auth-label">Mobile Number</label>
							<input
								className="auth-input"
								type="tel"
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
								placeholder="Enter your phone number"
								required
							/>
						</div>
						{error && <div className="auth-error">{error}</div>}
						<button className="auth-button auth-button-student" type="submit" disabled={loading}>
							{loading ? 'Sending OTP...' : 'Send OTP'}
						</button>
					</form>
				)}

				{step === STEPS.OTP && (
					<form className="auth-form" onSubmit={handleVerifyOtp}>
						{message && <div className="auth-success">{message}</div>}
						<p className="auth-description">
							Enter the 6-digit OTP sent to <strong>{phone}</strong>
						</p>
						<div className="auth-form-group">
							<label className="auth-label">OTP Code</label>
							<input
								className="auth-input auth-input-otp"
								type="text"
								value={otp}
								onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
								placeholder="000000"
								maxLength={6}
								required
							/>
						</div>
						{error && <div className="auth-error">{error}</div>}
						<button className="auth-button auth-button-student" type="submit" disabled={loading || otp.length !== 6}>
							{loading ? 'Verifying...' : 'Verify OTP'}
						</button>
						<button
							type="button"
							className="auth-link-button"
							onClick={() => { setStep(STEPS.PHONE); setError(''); setMessage(''); setOtp('') }}
						>
							Resend OTP
						</button>
					</form>
				)}

				{step === STEPS.NEW_PASSWORD && (
					<form className="auth-form" onSubmit={handleResetPassword}>
						{message && <div className="auth-success">{message}</div>}
						<div className="auth-form-group">
							<label className="auth-label">New Password</label>
							<input
								className="auth-input"
								type="password"
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								placeholder="Minimum 8 characters"
								minLength={8}
								required
							/>
						</div>
						<div className="auth-form-group">
							<label className="auth-label">Confirm Password</label>
							<input
								className="auth-input"
								type="password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								placeholder="Re-enter new password"
								minLength={8}
								required
							/>
						</div>
						{error && <div className="auth-error">{error}</div>}
						<button className="auth-button auth-button-student" type="submit" disabled={loading}>
							{loading ? 'Resetting...' : 'Reset Password'}
						</button>
					</form>
				)}

				{step === STEPS.SUCCESS && (
					<div className="auth-success-container">
						<div className="auth-success-icon">✓</div>
						<h2 className="auth-success-title">Password Reset Successful!</h2>
						<p className="auth-success-message">
							Your password has been changed. You can now login with your new password.
						</p>
						<button className="auth-button auth-button-student" onClick={() => navigate('/login', { replace: true })}>
							Go to Login
						</button>
					</div>
				)}

				{step !== STEPS.SUCCESS && (
					<div className="auth-footer">
						<div className="auth-footer-text">
							Remember your password? <Link to="/login" className="auth-footer-link">Login</Link>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
