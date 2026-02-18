import { axiosInstance } from './axiosInstance'

export async function listResources() {
	const { data } = await axiosInstance.get('/api/resources')
	return data
}

export async function getResourceById(id) {
	const { data } = await axiosInstance.get(`/api/resources/${id}`)
	return data
}

export async function createResource(payload) {
	const { data } = await axiosInstance.post('/api/resources', payload)
	return data
}

export async function updateResource(id, payload) {
	const { data } = await axiosInstance.put(`/api/resources/${id}`, payload)
	return data
}

export async function changeResourceStatus(id, payload) {
	const { data } = await axiosInstance.patch(`/api/resources/${id}/status`, payload)
	return data
}

export async function deleteResource(id) {
	await axiosInstance.delete(`/api/resources/${id}`)
}

