import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import * as authApi from '../api/authApi'

export const AuthContext = createContext(null)

function readStoredAuth() {
	const token = localStorage.getItem('auth_token')
	const rawUser = localStorage.getItem('auth_user')
	const expiresAt = localStorage.getItem('auth_expires_at')
	const user = rawUser ? JSON.parse(rawUser) : null
	return { token, user, expiresAt: expiresAt ? Number(expiresAt) : null }
}

export function AuthProvider({ children }) {
	const [{ token, user, expiresAt }, setAuth] = useState(() => readStoredAuth())

	useEffect(() => {
		if (token) localStorage.setItem('auth_token', token)
		else localStorage.removeItem('auth_token')

		if (user) localStorage.setItem('auth_user', JSON.stringify(user))
		else localStorage.removeItem('auth_user')

		if (expiresAt) localStorage.setItem('auth_expires_at', String(expiresAt))
		else localStorage.removeItem('auth_expires_at')
	}, [token, user, expiresAt])

	// Auto-logout when session expires
	useEffect(() => {
		if (!expiresAt) return

		const checkExpiry = () => {
			if (Date.now() >= expiresAt) {
				setAuth({ token: null, user: null, expiresAt: null })
			}
		}

		// Check immediately
		checkExpiry()

		// Check every second
		const interval = setInterval(checkExpiry, 1000)
		return () => clearInterval(interval)
	}, [expiresAt])

	const isAuthenticated = Boolean(token && user && (!expiresAt || Date.now() < expiresAt))

	const logout = useCallback(() => {
		setAuth({ token: null, user: null, expiresAt: null })
	}, [])

	const login = useCallback(async (payload) => {
		const data = await authApi.login(payload)
		setAuth({ token: data.token, user: data.user, expiresAt: data.expiresAt })
		return data
	}, [])

	const register = useCallback(async (payload) => {
		const data = await authApi.register(payload)
		setAuth({ token: data.token, user: data.user, expiresAt: data.expiresAt })
		return data
	}, [])

	const value = useMemo(
		() => ({
			token,
			user,
			expiresAt,
			isAuthenticated,
			login,
			register,
			logout,
		}),
		[token, user, expiresAt, isAuthenticated, login, register, logout]
	)

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

