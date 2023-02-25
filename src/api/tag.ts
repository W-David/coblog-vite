export function createTag<T = Tag, D = any>(data: D) {
	return POST<T, D>({
		url: '/tag/create',
		data,
	})
}

export function updateTag<T = Tag, D extends { id: number } = any>(data: D) {
	return PUT<T, D>({
		url: `/tag/update/${data.id}`,
		data,
	})
}

export function listTag<T = CountRow<Tag>>(params?: any) {
	return GET<T>({
		url: '/tag/list',
		params,
	})
}

export function listTagArticles<T = CountRow<TagArticle>>(params: any) {
	return GET<T>({
		url: '/tag/list/articles',
		params,
	})
}

export function detailTag<T = Tag>(id: number) {
	return GET<T>({
		url: `/tag/detail/${id}`,
	})
}

export function deleteTag<T = any>(id: number) {
	return DELETE<T>({
		url: `/tag/delete/${id}`,
	})
}
