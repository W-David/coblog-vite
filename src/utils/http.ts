import type { UrlAxiosRequestConfig } from './service'

const request = new service()

export function GET<T = any>(config: UrlAxiosRequestConfig) {
	return request.get<T>(config)
}

export function POST<T = any, D = any>(config: UrlAxiosRequestConfig<D>) {
	return request.post<T>(config)
}

export function PATCH<T = any, D = any>(config: UrlAxiosRequestConfig<D>) {
	return request.patch<T>(config)
}

export function PUT<T = any, D = any>(config: UrlAxiosRequestConfig<D>) {
	return request.put<T>(config)
}

export function DELETE<T = any>(config: UrlAxiosRequestConfig) {
	return request.delete<T>(config)
}
