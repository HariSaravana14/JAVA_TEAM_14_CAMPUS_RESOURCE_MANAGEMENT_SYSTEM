import { axiosInstance } from './axiosInstance'

export async function createBooking(payload) {
	const { data } = await axiosInstance.post('/api/bookings', payload)
	return data
}

export async function myBookings() {
	const { data } = await axiosInstance.get('/api/bookings/my')
	return data
}

export async function allBookings() {
	const { data } = await axiosInstance.get('/api/bookings/all')
	return data
}

export async function getAvailableSlots(resourceId, date) {
	const { data } = await axiosInstance.get(`/api/bookings/slots/${resourceId}`, {
		params: { date }
	})
	return data
}

export async function getPendingStaffApprovals() {
	const { data } = await axiosInstance.get('/api/approvals/staff/pending')
	return data
}

export async function staffApprove(bookingId) {
	const { data } = await axiosInstance.put(`/api/approvals/staff/${bookingId}`)
	return data
}

export async function staffReject(bookingId) {
	const { data } = await axiosInstance.put(`/api/approvals/staff/${bookingId}/reject`)
	return data
}

export async function getStaffStudentBookings() {
	const { data } = await axiosInstance.get('/api/approvals/staff/student-bookings')
	return data
}

export async function getStaffBookingStats() {
	const { data } = await axiosInstance.get('/api/approvals/staff/stats')
	return data
}

export async function getPendingAdminApprovals() {
	const { data } = await axiosInstance.get('/api/approvals/admin/pending')
	return data
}

export async function adminApprove(bookingId) {
	const { data } = await axiosInstance.put(`/api/approvals/admin/${bookingId}`)
	return data
}

export async function adminReject(bookingId) {
	const { data } = await axiosInstance.put(`/api/approvals/admin/${bookingId}/reject`)
	return data
}

