export default defineStore('useCategory', {
	state: (): {
		categoryMap: Map<number, Category>
		categoryArticlesMap: Map<number, CategoryArticle>
		checkedCateIds: number[]
	} => ({
		categoryMap: new Map(),
		categoryArticlesMap: new Map(),
		checkedCateIds: []
	}),
	getters: {
		getCategoryById: state => (id: number) => state.categoryMap.get(id),
		getCategoryArticleById: state => (id: number) => state.categoryArticlesMap.get(id),
		getCategoryList: state => () => [...state.categoryMap.values()],
		getCategoryArticles: state => () => [...state.categoryArticlesMap.values()],
		getCheckedCateIds: state => state.checkedCateIds
	},
	actions: {
		async CreateCategory(params = {}) {
			const res = await createCategory(params)
			if (res.data.code === 200 && res.data.data) {
				const category = res.data.data
				this.categoryMap.set(category.id, cloneLoop(category))
				this.categoryArticlesMap.set(category.id, {
					...cloneLoop(category),
					articles: []
				})
				return category
			} else {
				return null
			}
		},
		async GetCategories(params = {}): Promise<[Category[], number]> {
			const res = await listCategory(params)
			if (res.data.code === 200 && res.data.data) {
				const categories = res.data.data.rows || []
				const total = res.data.data.count || 0
				categories.forEach(item => {
					this.categoryMap.set(item.id, cloneLoop(item))
				})
				return [categories, total]
			} else {
				return [[], 0]
			}
		},
		async GetCategoryArticles(data = {}): Promise<[CategoryArticle[], number]> {
			const res = await listCategoryArticles(data)
			if (res.data.code === 200 && res.data.data) {
				const categories = res.data.data.rows || []
				const total = res.data.data.count || 0
				categories.forEach(item => {
					this.categoryArticlesMap.set(item.id, cloneLoop(item))
				})
				return [categories, total]
			} else {
				return [[], 0]
			}
		},
		async GetCategory(categoryId: number) {
			const curCategory = this.categoryMap.get(categoryId)
			if (curCategory?.name) {
				return Promise.resolve(curCategory)
			}
			const res = await detailCategory(categoryId)
			if (res.data.code === 200 && res.data.data) {
				const category = res.data.data
				this.categoryMap.set(category.id, cloneLoop(category))
				return category
			} else {
				return null
			}
		},
		async DelCategory(categoryId: number) {
			const res = await deleteCategory(categoryId)
			if (res.data.code === 200 && res.data.data) {
				const category = res.data.data
				this.categoryMap.delete(category.id)
				this.categoryArticlesMap.delete(category.id)
				return category
			} else {
				return null
			}
		}
	}
})
