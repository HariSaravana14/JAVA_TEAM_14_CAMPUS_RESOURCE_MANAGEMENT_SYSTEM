import { axiosInstance } from './axiosInstance'

export async function login(payload) {
	const { data } = await axiosInstance.post('/api/auth/login', payload)
	return data
}

export async function loginWithRole(email, password, expectedRole) {
	const { data } = await axiosInstance.post('/api/auth/login', { email, password, expectedRole })
	return data
}

export async function register(payload) {
	const { data } = await axiosInstance.post('/api/auth/register', payload)
	return data
}

export async function getAdvisors() {
	const { data } = await axiosInstance.get('/api/auth/advisors')
	return data
}

export async function sendOtp(payload) {
	const { data } = await axiosInstance.post('/api/auth/forgot-password/send-otp', payload)
	return data
}

export async function verifyOtp(payload) {
	const { data } = await axiosInstance.post('/api/auth/forgot-password/verify-otp', payload)
	return data
}

export async function resetPassword(payload) {
	const { data } = await axiosInstance.post('/api/auth/forgot-password/reset-password', payload)
	return data
}

