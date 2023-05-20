export function createCategory<T = Category, D = any>(data: D) {
	return POST<T, D>({
		url: '/category/create',
		data
	})
}

export function updateCategory<T = Category, D extends { id: number } = any>(data: D) {
	return PUT<T, D>({
		url: `/category/update/${data.id}`,
		data
	})
}

export function listCategory<T = CountRow<Category>>(params?: any) {
	return GET<T>({
		url: '/category/list',
		params
	})
}

export function listCategoryArticles<T = CountRow<CategoryArticle>>(params: any) {
	return GET<T>({
		url: '/category/list/articles',
		params
	})
}

export function detailCategory<T = Category>(id: number) {
	return GET<T>({
		url: `/category/detail/${id}`
	})
}

export function deleteCategory<T = any>(id: number) {
	return DELETE<T>({
		url: `/category/delete/${id}`
	})
}
