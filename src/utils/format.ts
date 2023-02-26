export function articles2Archive(archive: ArticleTime[]): ArticleArchive[] {
	if (!archive?.length) return []
	let curTime = ''
	let curArticles: ArticleTime[] = []
	const resList: ArticleArchive[] = []
	const format: 'month' | 'week' | 'day' = archive[0].month
		? 'month'
		: archive[0].week
		? 'week'
		: 'day'
	for (let i = 0, len = archive.length; i < len; i++) {
		const year = archive[i][format]?.split('-')[0]
		const time =
			format === 'month'
				? `${year}年, ${archive[i][format]?.split('-')[1]}月`
				: format === 'week'
				? `${year}年, 第${archive[i][format]?.split('-')[1]}周`
				: `${year}年, ${archive[i][format]?.split('-')[1]}月, ${
						archive[i][format]?.split('-')[2]
				  }日`
		if (curTime !== time) {
			const curArchive = { time, articles: [] }
			resList.push(curArchive)
			curTime = time
			curArticles = curArchive.articles
		}
		curArticles.push(archive[i])
	}
	return resList
}

export function concatArchive(
	cachedArchive: ArticleArchive[],
	archive: ArticleArchive[]
): ArticleArchive[] {
	const lastCachedArchive = cachedArchive[cachedArchive.length - 1]
	if (!archive?.length) {
		return cachedArchive.concat([])
	}
	const firstNewArchive = archive[0]
	const needConcatArticle = lastCachedArchive.time === firstNewArchive.time
	if (needConcatArticle) {
		lastCachedArchive.articles.push(...firstNewArchive.articles)
		return cachedArchive.concat(archive.slice(1))
	} else {
		return cachedArchive.concat(archive)
	}
}

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
