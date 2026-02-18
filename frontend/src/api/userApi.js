import { axiosInstance } from './axiosInstance'

export async function listUsers() {
	const { data } = await axiosInstance.get('/api/users')
	return data
}

export async function updateUser(id, payload) {
	const { data } = await axiosInstance.put(`/api/users/${id}`, payload)
	return data
}

export async function deleteUser(id) {
	await axiosInstance.delete(`/api/users/${id}`)
}

export async function getMyStudents() {
	const { data } = await axiosInstance.get('/api/users/my-students')
	return data
}

export async function getMyStudentStats() {
	const { data } = await axiosInstance.get('/api/users/my-students/stats')
	return data
}

