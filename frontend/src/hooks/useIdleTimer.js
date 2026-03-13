import { useEffect, useRef, useCallback } from 'react'

const IDLE_EVENTS = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click']

/**
 * Idle-timeout hook.
 * Calls `onIdle()` after `timeout` ms of user inactivity.
 * Resets the timer on any mouse / keyboard / scroll / touch event.
 * Pass `enabled = false` to disable entirely (e.g. for ADMIN users).
 */
export default function useIdleTimer({ timeout = 5 * 60 * 1000, onIdle, enabled = true }) {
	const timerRef = useRef(null)

	const resetTimer = useCallback(() => {
		if (timerRef.current) clearTimeout(timerRef.current)
		timerRef.current = setTimeout(() => {
			onIdle()
		}, timeout)
	}, [timeout, onIdle])

	useEffect(() => {
		if (!enabled) return

		// Start the timer immediately
		resetTimer()

		const handleActivity = () => resetTimer()

		IDLE_EVENTS.forEach((evt) => window.addEventListener(evt, handleActivity, { passive: true }))

		return () => {
			if (timerRef.current) clearTimeout(timerRef.current)
			IDLE_EVENTS.forEach((evt) => window.removeEventListener(evt, handleActivity))
		}
	}, [enabled, resetTimer])
}
