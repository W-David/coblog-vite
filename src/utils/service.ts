import type {
	AxiosInstance,
	AxiosRequestConfig,
	AxiosResponse,
	CancelTokenStatic,
	InternalAxiosRequestConfig,
} from 'axios'

export type NOMethodAxiosRequestConfig<D = any> = Omit<
	AxiosRequestConfig<D>,
	'method'
> &
	CustomRequestConfig

export type UrlAxiosRequestConfig<D = any> = Omit<
	NOMethodAxiosRequestConfig<D>,
	'url'
> & {
	url: string
}

export interface CustomRequestConfig {
	cache?: boolean
	forceUpdate?: boolean
	retryTime?: number
	retryDelay?: number
	retryCount?: number
}

export type CustomAxiosRequestConfig<D = any> = InternalAxiosRequestConfig<D> &
	CustomRequestConfig

export interface RawCacheOption {
	enableCache: boolean
	enableForceUpdate: boolean
}

export interface RawRetryOption {
	defaultTime: number
	defaultDelay: number
}

export type CacheOption = Partial<RawCacheOption>
export type RetryOption = Partial<RawRetryOption>

//错误码
enum errorCode {
	'认证失败' = 401,
	'权限不足' = 403,
	'资源不存在' = 404,
	'服务端错误' = 500,
	'未知错误' = -1,
}

const initConfig: AxiosRequestConfig = {
	baseURL: import.meta.env.VITE_APP_BASE_URL,
	timeout: 30000,
}

class Request {
	instance: AxiosInstance
	baseConfig: AxiosRequestConfig = initConfig
	CancelToken: CancelTokenStatic = axios.CancelToken
	controller: AbortController | null = null
	initCacheOption: RawCacheOption = {
		enableCache: true,
		enableForceUpdate: false,
	}
	initRetryOption: RawRetryOption = {
		defaultTime: 3,
		defaultDelay: 300,
	}
	static cacheObj = new LRUCache<string, AxiosResponse>({
		max: 500,
		ttl: 1000 * 60 * 5,
	})

	constructor(config?: AxiosRequestConfig) {
		const axiosConfig = Object.assign(this.baseConfig, config)
		this.instance = axios.create(axiosConfig)
		const { reqCacheEnhancer, resCacheEnhancer } = this.generateCacheEnhancer()
		const retryEnhancer = this.generateRetryEnhancer()

		this.instance.interceptors.request.use(
			(config: CustomAxiosRequestConfig) => {
				console.log(`request ${config.url} config:`, config)
				const isToken = !config.headers.unToken ?? true
				const token = encodeToken()
				console.log('request isToken:', isToken)
				console.log('request token:', token)
				if (token && isToken) {
					config.headers['Authorization'] = token
					console.log('request header authorization setted:', token)
				}
				return reqCacheEnhancer(config)
			},
			(err: any) => {
				console.log('request err:', err.message)
				Promise.reject(err)
			}
		)

		this.instance.interceptors.response.use(
			(res: AxiosResponse<HResponseType<any>>) => {
				console.log(`response ${res.config.url} is:`, res)
				const code = res.data.code || 200
				const msg = errorCode[code] || res.data.msg || errorCode[-1]
				if (
					res.request.responseType === 'blob' ||
					res.request.responseType === 'arraybuffer'
				) {
					return res
				}
				if (code !== 200) {
					ElMessage({ message: msg, type: 'warning', grouping: true })
					return Promise.reject(new Error(msg))
				} else {
					return resCacheEnhancer(res)
				}
			},
			(err: any) => {
				let { message } = err
				const { config } = err
				if (message === 'canceled') {
					const reqKey = this.generateReqKey(config)
					console.log(`${config.url} has been canceled, reqKey:`, reqKey)
					const cacheRes = Request.cacheObj.get(reqKey)
					console.log(`${config.url} has been canceled, cacheRes:`, cacheRes)
					return Promise.resolve(cacheRes)
				}
				if (message == 'Network Error') {
					message = '网络错误'
				} else if (message.includes('timeout')) {
					message = '请求超时'
				} else if (message.includes('Request failed with status code')) {
					message = '接口' + message.substr(message.length - 3) + '异常'
				} else {
					message = '未知错误'
				}
				console.log('response err:', message)
				ElMessage({
					message: message + ', 请求重试中...',
					type: 'error',
					grouping: true,
				})
				// return Promise.reject(err)
				return retryEnhancer(err)
			}
		)
	}

	private isEnableCache(res?: AxiosResponse<HResponseType>) {
		if (!res) return false
		const isArray = (data: any) =>
			Object.prototype.toString.call(data) === '[object Array]'
		const isObject = (data: object) =>
			Object.prototype.toString.call(data) === '[object Object]'
		if (res?.data?.data) {
			if (isArray(res.data.data)) {
				console.log(`res ${res.config.url}'s data is array`, res.data.data)
				return res.data.data.length > 0
			} else if (isObject(res.data.data)) {
				console.log(`res ${res.config.url}'s data is object`, res.data.data)
				return Object.keys(res.data.data).length > 0
			} else {
				console.log(`res ${res.config.url}'s data isn't empty`, res.data.data)
				return true
			}
		}
		console.log(`res ${res.config.url}'s data is empty`, res.data.data)
		return false
	}
	private generateReqKey(config: CustomAxiosRequestConfig) {
		const { method, url, params, data } = config
		return [method, url, QS.stringify(params), QS.stringify(data)].join('&')
	}

	private generateCacheEnhancer(options?: CacheOption) {
		const enableCache = options?.enableCache ?? this.initCacheOption.enableCache
		const enableForceUpdate =
			options?.enableForceUpdate ?? this.initCacheOption.enableForceUpdate
		return {
			reqCacheEnhancer: (config: CustomAxiosRequestConfig) => {
				const {
					method,
					cache = enableCache,
					forceUpdate = enableForceUpdate,
				} = config
				const isGet = method === 'GET' || method === 'get'
				// if (this.controller) {
				// 	this.controller = new AbortController()
				// 	config.signal = this.controller.signal
				// }
				if (isGet && cache) {
					const reqKey = this.generateReqKey(config)
					const cacheRes = Request.cacheObj.get(reqKey)
					console.log(`request ${config.url} reqKey:`, reqKey)
					console.log(`request ${config.url} cacheRes:`, cacheRes)
					console.log(
						`request ${config.url} isEnable:`,
						this.isEnableCache(cacheRes)
					)
					// 如果命中了缓存并且不需要强制刷新，就取消这个请求,注: 需要在返回的错误拦截器上对被取消的请求做处理
					if (this.isEnableCache(cacheRes) && !forceUpdate) {
						console.log(`request ${config.url} abort, cacheRes:`, cacheRes)
						this.controller = new AbortController()
						config.signal = this.controller.signal
						this.controller.abort()
						this.controller = null
					}
				}
				return config
			},
			resCacheEnhancer: (res: AxiosResponse) => {
				const config: CustomAxiosRequestConfig = res.config
				const {
					method,
					cache = enableCache,
					forceUpdate = enableForceUpdate,
				} = config
				const isGet = method === 'GET' || method === 'get'
				if (isGet && cache) {
					const reqKey = this.generateReqKey(config)
					const cacheRes = Request.cacheObj.get(reqKey)
					console.log(`response ${config.url} reqKey:`, reqKey)
					//如果未命中缓存或者需要强制刷新，就更新缓存并且返回最新的返回值
					if (!this.isEnableCache(cacheRes) || forceUpdate) {
						console.log(`response ${config.url} cached:`, res)
						Request.cacheObj.set(reqKey, cloneForce(res))
						return res
					}
					//否则返回缓存值
					return cloneForce(cacheRes)
				}
				return res
			},
		}
	}

	private generateRetryEnhancer(options?: RetryOption) {
		const defaultTime = options?.defaultTime ?? this.initRetryOption.defaultTime
		const defaultDelay =
			options?.defaultDelay ?? this.initRetryOption.defaultDelay
		return async (err: any) => {
			const config: CustomAxiosRequestConfig = err.config
			if (!config) {
				console.log('response retry err:', err)
				return Promise.reject(err)
			}
			const {
				retryTime = defaultTime,
				retryDelay = defaultDelay,
				retryCount = 0,
			} = config
			config.retryCount = retryCount
			if (retryCount >= retryTime) {
				console.log('response retry is end')
				return Promise.reject(err)
			}
			config.retryCount++
			const delay = new Promise<void>((res) => {
				setTimeout(() => res(), retryDelay)
			})
			await delay
			console.log(`response retrying, retryCount is ${config.retryCount}`)
			return this.request(config)
		}
	}

	public request<T = any, D = any>(config: CustomAxiosRequestConfig<D>) {
		return this.instance.request<HResponseType<T>>(config)
	}
	public get<T = any, D = any>(config: UrlAxiosRequestConfig<D>) {
		return this.instance.get<HResponseType<T>>(config.url, config)
	}
	public post<T = any, D = any>(config: UrlAxiosRequestConfig<D>) {
		return this.instance.post<HResponseType<T>>(config.url, config.data, config)
	}
	public patch<T = any, D = any>(config: UrlAxiosRequestConfig<D>) {
		return this.instance.patch<HResponseType<T>>(
			config.url,
			config.data,
			config
		)
	}
	public put<T = any, D = any>(config: UrlAxiosRequestConfig<D>) {
		return this.instance.put<HResponseType<T>>(config.url, config.data, config)
	}
	public delete<T = any, D = any>(config: UrlAxiosRequestConfig<D>) {
		return this.instance.delete<HResponseType<T>>(config.url, config)
	}
}

export default Request
