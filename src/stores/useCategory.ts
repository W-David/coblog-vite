import { SortOrder } from '~/graphql/generated/graphql'

export default defineStore('useCategory', {
	state: (): {
		categoryMap: Map<number, Category>
		categoryArticlesMap: Map<number, CategoryArticle>
		checkedCateIds: number[]
		isCategoryMapLoading: boolean
		isCategoryArticlesMapLoading: boolean
	} => ({
		categoryMap: new Map(),
		categoryArticlesMap: new Map(),
		checkedCateIds: [],
		isCategoryMapLoading: false,
		isCategoryArticlesMapLoading: false
	}),
	getters: {
		getCategoryById: state => (id: number) => state.categoryMap.get(id),
		getCategoryArticleById: state => (id: number) => state.categoryArticlesMap.get(id),
		getCategoryList: state => () => [...state.categoryMap.values()],
		getCategoryArticles: state => () => [...state.categoryArticlesMap.values()],
		getCheckedCateIds: state => state.checkedCateIds
	},
	actions: {
		CreateCategory(params: { name: string }) {
			return new Promise<Category>((resolve, reject) => {
				const { mutate, onDone, onError } = useMutation(createOneCategory)
				mutate({
					data: {
						name: params.name
					}
				})
				onDone(result => {
					const category = result.data?.createOneCategory
					if (!category) {
						return
					}
					this.categoryMap.set(category.id, cloneLoop(category))
					this.categoryArticlesMap.set(category.id, {
						...cloneLoop(category),
						articles: []
					})
					resolve(category)
				})
				onError(error => {
					reject(error)
				})
			})
		},
		GetCategories(data: { take: number; cursor?: { id: number } }) {
			this.isCategoryMapLoading = true
			const { take, cursor } = data
			const { onResult, onError } = useQuery(categories, {
				take,
				skip: cursor ? 1 : undefined,
				cursor: cursor
					? {
							id: cursor.id
					  }
					: undefined,
				orderBy: {
					id: SortOrder.Asc
				}
			})
			onResult(result => {
				this.isCategoryMapLoading = false
				const categories = result.data?.categories || []
				if (!categories.length) {
					return
				}
				categories.forEach(item => {
					this.categoryMap.set(item.id, cloneLoop(item))
				})
			})
			onError(() => {
				this.isCategoryMapLoading = false
			})
		},
		async GetCategoryWithArticles(data = {}): Promise<[CategoryArticle[], number]> {
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
		DelCategory(categoryId: number) {
			const { mutate, onDone } = useMutation(deleteOneCategory)
			mutate({
				where: {
					id: categoryId
				}
			})
			onDone(result => {
				const category = result.data?.deleteOneCategory
				if (!category) {
					return
				}
				this.categoryMap.delete(category.id)
				this.categoryArticlesMap.delete(category.id)
			})
		}
	}
})
