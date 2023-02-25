export function createArticle<T = Article, D = any>(data: D) {
	return POST<T, D>({
		url: '/article/create',
		data,
	})
}

export function updateArticle<T = Article, D extends { id: number } = any>(
	data: D
) {
	return PUT<T, D>({
		url: `/article/update/${data.id}`,
		data,
	})
}

export function favoriteArticle<T = number, D extends { id: number } = any>(
	data: D
) {
	return PATCH<T, D>({
		url: `/article/favorite/${data.id}`,
		data,
	})
}

export function listArticle<T = CountRow<Article>>(params: any) {
	return GET<T>({
		url: '/article/list',
		params,
	})
}

export function listByTimeArticle<T = Array<ArticleRecent>>(params: any) {
	return GET<T>({
		url: '/article/listByTime',
		params,
	})
}

export function listByFavoArticle<T = Array<ArticleHot>>(params: any) {
	return GET<T>({
		url: '/article/listByFavo',
		params,
	})
}

export function listArchive<T = CountRow<ArticleTime>>(params: any) {
	return GET<T>({
		url: '/article/listArchive',
		params,
	})
}

export function detailArticle<T = Article>(id: number) {
	return GET<T>({
		url: `/article/detail/${id}`,
		params: { noHtml: true },
	})
}

export function noAuthDetailArticle<T = Article>(id: number) {
	return GET<T>({
		url: `/article/noAuthDetail/${id}`,
	})
}

export function deleteArticle<T = any>(id: number) {
	return DELETE<T>({
		url: `/article/delete/${id}`,
	})
}
