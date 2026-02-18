import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'

export const axiosInstance = axios.create({
	baseURL: apiBaseUrl,
	headers: {
		'Content-Type': 'application/json',
	},
})

axiosInstance.interceptors.request.use((config) => {
	const token = localStorage.getItem('auth_token')
	if (token) {
		config.headers = config.headers ?? {}
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

export function extractErrorMessage(error) {
	const response = error?.response
	if (!response) return error?.message || 'Network error'

	const data = response.data
	if (typeof data === 'string') return data
	if (data?.message) return data.message
	if (data?.error) return data.error
	return `Request failed (${response.status})`
}

