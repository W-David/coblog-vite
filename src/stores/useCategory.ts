import { SortOrder } from '~/graphql/generated/graphql'

export default defineStore('useCategory', {
	state: (): {
		categoryMap: Map<number, Category>
		categoryArticlesMap: Map<number, CategoryArticle>
		checkedCateIds: number[]
		isCategoryMapLoading: boolean
		isCategoryArticlesMapLoading: boolean
		curCategoryArticleList: CategoryArticle[]
	} => ({
		categoryMap: new Map(),
		categoryArticlesMap: new Map(),
		checkedCateIds: [],
		isCategoryMapLoading: false,
		isCategoryArticlesMapLoading: false,
		curCategoryArticleList: []
	}),
	getters: {
		getCurCategoryArticleList: state => cloneLoop(state.curCategoryArticleList),
		getCategoryById: state => (id: number) => cloneLoop(state.categoryMap.get(id)),
		getCategoryArticleById: state => (id: number) => cloneLoop(state.categoryArticlesMap.get(id)),
		getCategoryList: state => () => cloneLoop(Array.from(state.categoryMap.values())),
		getCategoryArticles: state => () => cloneLoop(Array.from(state.categoryArticlesMap.values())),
		getCategoryArticlesCursor: state => cloneLoop(Array.from(state.categoryArticlesMap.values()).slice(-1)[0]),
		getCheckedCateIds: state => cloneLoop(state.checkedCateIds)
	},
	actions: {
		CreateCategory(params: { name: string }) {
			return new Promise<Category>((resolve, reject) => {
				onApolloContext(() => {
					const { mutate, onDone, onError } = useMutation(createOneCategory)
					mutate({
						data: {
							name: params.name
						}
					})
					onDone(result => {
						if (result.errors) {
							return
						}
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
			})
		},
		GetCategories(data: { take: number; cursor?: { id: number } }) {
			this.isCategoryMapLoading = true
			const { take, cursor } = data
			onApolloContext(() => {
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
					if (result.networkStatus !== NetworkStatus.ready) {
						return
					}
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
			})
		},
		GetCategoryWithArticles(data: { take: number; cursor?: { id: number } }) {
			this.isCategoryArticlesMapLoading = true
			const { take, cursor } = data
			onApolloContext(() => {
				const { onResult, onError } = useQuery(getCategoriesWithPosts, {
					orderBy: [
						{
							id: SortOrder.Asc
						}
					],
					cursor: cursor
						? {
								id: cursor.id
						  }
						: undefined,
					skip: cursor ? 1 : undefined,
					take: take + 1,
					categoriesOnPostsOrderBy: [
						{
							postId: {
								sort: SortOrder.Asc
							}
						}
					],
					categoriesOnPostsTake: 5
				})
				onResult(result => {
					if (result.networkStatus !== NetworkStatus.ready) {
						return
					}
					this.isCategoryArticlesMapLoading = false
					const categories = result.data?.categories || []
					if (!categories.length) {
						return
					}
					this.curCategoryArticleList = categories.map(item => categoriesToCategoryArticle(item))
					categories.slice(0, take).forEach(item => {
						this.categoryArticlesMap.set(item.id, categoriesToCategoryArticle(item))
					})
				})
				onError(() => {
					this.isCategoryArticlesMapLoading = false
				})
			})
		},
		DelCategory(categoryId: number) {
			onApolloContext(() => {
				const { mutate, onDone } = useMutation(deleteOneCategory)
				mutate({
					where: {
						id: categoryId
					}
				})
				onDone(result => {
					if (result.errors) {
						return
					}
					const category = result.data?.deleteOneCategory
					if (!category) {
						return
					}
					this.categoryMap.delete(category.id)
					this.categoryArticlesMap.delete(category.id)
				})
			})
		}
	}
})
