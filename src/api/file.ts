export function uploadFile<T = any, D = any>(data: D) {
	return POST<T, D>({
		url: '/upload',
		headers: {
			'Content-Type': 'multipart/form-data',
		},
		data,
	})
}

export function addFile<T = any, D = any>(data: D) {
	return POST<T, D>({
		url: '/upload/add',
		data,
	})
}

export function getFile<T = any>(id: number) {
	return GET<T>({
		url: `/upload/${id}`,
	})
}

export function deleteFile<T = any>(id: number) {
	return DELETE<T>({
		url: `/upload/${id}`,
	})
}
