import dayjs from './day'

export type Format = 'timeline' | 'day' | 'month' | 'week'

export function timeLineArticles2FormatedArticles(articles: Article[], format: Format): ArticleTime[] {
	if (!articles.length) return []
	return articles.map(article => {
		const formatedArticle: ArticleTime = {
			id: article.id,
			title: article.title,
			description: article.description,
			createdAt: article.createdAt,
			categories: article.categories ? article.categories.map(({ id, name }) => ({ id, name })) : [],
			tags: article.tags ? article.tags.map(({ id, name }) => ({ id, name })) : [],
			browse: article.browse
		}
		const createdAt = dayjs(article.createdAt)
		if (format === 'timeline') {
			return { ...formatedArticle, timeline: createdAt.format('YYYY-MM-DD HH:mm:ss') }
		}
		if (format === 'day') {
			return { ...formatedArticle, day: createdAt.format('YYYY-MM-DD') }
		}
		if (format === 'month') {
			return { ...formatedArticle, month: createdAt.format('YYYY-MM') }
		}
		if (format === 'week') {
			return { ...formatedArticle, week: createdAt.format('YYYY-W') }
		}
		return formatedArticle
	})
}
export function articles2Archive(archives: ArticleTime[], format: Format): ArticleArchive[] {
	if (!archives?.length) return []
	let curTime = ''
	let curArticles: ArticleTime[] = []
	const resList: ArticleArchive[] = []
	for (let i = 0, len = archives.length; i < len; i++) {
		const time = archives[i][format] || ''
		if (curTime !== time) {
			const curArchive = { time, articles: [] }
			resList.push(curArchive)
			curTime = time
			curArticles = curArchive.articles
		}
		curArticles.push(archives[i])
	}
	return resList
}

export function concatArchive(cachedArchive: ArticleArchive[], archive: ArticleArchive[]): ArticleArchive[] {
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
