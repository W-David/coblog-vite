export type Format = 'day' | 'week' | 'month' | 'year'

//不含最大值，含最小值（向上取整）的随机整数
function getRandomInteger(min: number, max: number) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min)) + min
}

//含最大值，含最小值的随机整数
export function getRandomIntInclusive(min: number, max: number) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1)) + min
}

export function getRandomItem(arr: any[]) {
	return arr[getRandomInteger(0, arr.length)]
}

// 解决JSON.stringify的undefined和函数丢失问题
export function JSONStringify(option: any) {
	return JSON.stringify(option, (key, val) => {
		// 处理函数丢失问题
		if (typeof val === 'function') {
			return `${val}`
		}
		// 处理undefined丢失问题
		if (typeof val === 'undefined') {
			return 'undefined'
		}
		return val
	})
}
export function JSONParse(objStr: any) {
	return JSON.parse(objStr, (k, v) => {
		if (typeof v === 'string' && v.indexOf && v.indexOf('function') > -1) {
			// eslint-disable-next-line
			return eval(`(function(){return ${v}})()`)
		}
		return v
	})
}
