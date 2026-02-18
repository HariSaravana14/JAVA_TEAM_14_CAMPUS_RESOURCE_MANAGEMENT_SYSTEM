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
		<div className="container" style={{ maxWidth: 520 }}>
			<div className="card stack">
				<div style={{ fontWeight: 800, fontSize: 20 }}>Forgot Password</div>

				{/* Progress indicator */}
				<div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 8 }}>
					{[1, 2, 3].map((s) => (
						<div
							key={s}
							style={{
								width: 32,
								height: 4,
								borderRadius: 2,
								background: step >= s ? '#2563eb' : '#e5e7eb',
								transition: 'background 0.2s',
							}}
						/>
					))}
				</div>

				{step === STEPS.PHONE && (
					<form className="stack" onSubmit={handleSendOtp}>
						<div style={{ fontSize: 14, color: '#6b7280', marginBottom: 4 }}>
							Enter your registered mobile number to receive an OTP
						</div>
						<label className="stack" style={{ gap: 6 }}>
							<div style={{ fontSize: 13, color: '#374151' }}>Mobile Number</div>
							<input
								className="input"
								type="tel"
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
								placeholder="Enter your phone number"
								required
							/>
						</label>
						{error && <div className="error">{error}</div>}
						<button className="button" type="submit" disabled={loading}>
							{loading ? 'Sending OTP...' : 'Send OTP'}
						</button>
					</form>
				)}

				{step === STEPS.OTP && (
					<form className="stack" onSubmit={handleVerifyOtp}>
						{message && <div style={{ fontSize: 13, color: '#059669', background: '#ecfdf5', padding: '8px 12px', borderRadius: 6 }}>{message}</div>}
						<div style={{ fontSize: 14, color: '#6b7280', marginBottom: 4 }}>
							Enter the 6-digit OTP sent to <strong>{phone}</strong>
						</div>
						<label className="stack" style={{ gap: 6 }}>
							<div style={{ fontSize: 13, color: '#374151' }}>OTP Code</div>
							<input
								className="input"
								type="text"
								value={otp}
								onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
								placeholder="Enter 6-digit OTP"
								maxLength={6}
								required
								style={{ letterSpacing: 8, textAlign: 'center', fontSize: 20, fontWeight: 600 }}
							/>
						</label>
						{error && <div className="error">{error}</div>}
						<button className="button" type="submit" disabled={loading || otp.length !== 6}>
							{loading ? 'Verifying...' : 'Verify OTP'}
						</button>
						<button
							type="button"
							style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}
							onClick={() => { setStep(STEPS.PHONE); setError(''); setMessage(''); setOtp('') }}
						>
							Resend OTP
						</button>
					</form>
				)}

				{step === STEPS.NEW_PASSWORD && (
					<form className="stack" onSubmit={handleResetPassword}>
						{message && <div style={{ fontSize: 13, color: '#059669', background: '#ecfdf5', padding: '8px 12px', borderRadius: 6 }}>{message}</div>}
						<label className="stack" style={{ gap: 6 }}>
							<div style={{ fontSize: 13, color: '#374151' }}>New Password</div>
							<input
								className="input"
								type="password"
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								placeholder="Minimum 8 characters"
								minLength={8}
								required
							/>
						</label>
						<label className="stack" style={{ gap: 6 }}>
							<div style={{ fontSize: 13, color: '#374151' }}>Confirm Password</div>
							<input
								className="input"
								type="password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								placeholder="Re-enter new password"
								minLength={8}
								required
							/>
						</label>
						{error && <div className="error">{error}</div>}
						<button className="button" type="submit" disabled={loading}>
							{loading ? 'Resetting...' : 'Reset Password'}
						</button>
					</form>
				)}

				{step === STEPS.SUCCESS && (
					<div className="stack" style={{ textAlign: 'center' }}>
						<div style={{ fontSize: 40 }}>&#10003;</div>
						<div style={{ fontSize: 16, fontWeight: 600, color: '#059669' }}>Password Reset Successful!</div>
						<div style={{ fontSize: 14, color: '#6b7280' }}>
							Your password has been changed. You can now login with your new password.
						</div>
						<button className="button" onClick={() => navigate('/login', { replace: true })}>
							Go to Login
						</button>
					</div>
				)}

				{step !== STEPS.SUCCESS && (
					<div style={{ fontSize: 13, color: '#374151' }}>
						Remember your password? <Link to="/login" style={{ textDecoration: 'underline' }}>Login</Link>
					</div>
				)}
			</div>
		</div>
	)
}
