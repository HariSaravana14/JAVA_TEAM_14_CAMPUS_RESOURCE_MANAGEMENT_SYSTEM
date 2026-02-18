export function formatDate(isoDate) {
	if (!isoDate) return ''
	// Backend sends LocalDate like "2026-02-17"
	return isoDate
}

export function formatTime(isoTime) {
	if (!isoTime) return ''
	// Backend sends LocalTime like "10:00" or "10:00:00"
	return isoTime.length > 5 ? isoTime.slice(0, 5) : isoTime
}

export function toLocalTimeString(input) {
	// input from <input type="time"> => "HH:mm"
	return input
}

