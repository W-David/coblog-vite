export function login<T = Admin, D = any>(data: D) {
	return POST<T, D>({
		url: '/admin/login',
		data
	})
}

export function register<T = Admin, D = any>(data: D) {
	return POST<T, D>({
		url: '/admin/register',
		data
	})
}

export function auth<T = Admin>() {
	return GET<T>({
		url: '/admin/auth',
		cache: false
	})
}

export function listAdmin<T = CountRow<Admin>>(params: any) {
	return GET<T>({
		url: '/admin/list',
		params
	})
}

export function detailAdmin<T = Admin>(id: number) {
	return GET<T>({
		url: `/admin/detail/${id}`,
		cache: false
	})
}

export function updateAdmin<T = Admin, D extends { id: number } = any>(data: D) {
	return PUT<T, D>({
		url: `/admin/update/${data.id}`,
		data
	})
}

export function deleteAdmin<T = any>(id: number) {
	return DELETE<T>({
		url: `/admin/delete/${id}`
	})
}
