const session = {
	set(key: string, value: any) {
		if (!sessionStorage) {
			return
		}
		if (key != null && value != null) {
			sessionStorage.setItem(key, value)
		}
	},
	get(key: string) {
		if (!sessionStorage) {
			return null
		}
		if (key == null) {
			return null
		}
		return sessionStorage.getItem(key)
	},
	setJSON(key: string, jsonValue: object) {
		if (jsonValue != null) {
			this.set(key, JSON.stringify(jsonValue))
		}
	},
	getJSON(key: string) {
		const value = this.get(key)
		if (value != null) {
			return JSON.parse(value)
		}
		return null
	},
	remove(key: string) {
		sessionStorage.removeItem(key)
	}
}

const local = {
	set(key: string, value: string) {
		if (!localStorage) {
			return
		}
		if (key != null && value != null) {
			localStorage.setItem(key, value)
		}
	},
	get(key: string) {
		if (!localStorage) {
			return null
		}
		if (key == null) {
			return null
		}
		return localStorage.getItem(key)
	},
	setJSON(key: string, jsonValue: object | null) {
		if (jsonValue != null) {
			this.set(key, JSON.stringify(jsonValue))
		}
	},
	getJSON(key: string) {
		const value = this.get(key)
		if (value != null) {
			return JSON.parse(value)
		}
		return null
	},
	remove(key: string) {
		localStorage.removeItem(key)
	}
}

class LRU<K = string, V = any> {
	max: number
	cache: Map<K, V>
	constructor({ max = 1024 }: { max?: number }) {
		this.max = max
		this.cache = new Map()
	}

	public get(key: K) {
		const item = this.cache.get(key)
		if (item) {
			// refresh key
			this.cache.delete(key)
			this.cache.set(key, item)
		}
		return item
	}

	public set(key: K, val: V) {
		// refresh key
		if (this.cache.has(key)) this.cache.delete(key)
		// evict oldest
		else if (this.cache.size == this.max) this.cache.delete(this.first())
		this.cache.set(key, val)
	}

	private first() {
		return this.cache.keys().next().value
	}
}

export { session as sessionCache, local as localCache, LRU as LRU }
