import { SortOrder } from '~/graphql/generated/graphql'

export default defineStore('useCategory', {
	state: (): {
		categoryMap: Map<number, Category>
		categoryArticlesMap: Map<number, CategoryArticle>
		checkedCateIds: number[]
		isCategoryMapLoading: boolean
		isCategoryArticlesMapLoading: boolean
		isCategoryArticlesHasMore: boolean
	} => ({
		categoryMap: new Map(),
		categoryArticlesMap: new Map(),
		checkedCateIds: [],
		isCategoryMapLoading: false,
		isCategoryArticlesMapLoading: false,
		isCategoryArticlesHasMore: true
	}),
	getters: {
		getCategoryById: state => (id: number) => state.categoryMap.get(id),
		getCategoryArticleById: state => (id: number) => state.categoryArticlesMap.get(id),
		getCategoryList: state => () => [...state.categoryMap.values()],
		getCategoryArticles: state => () => [...state.categoryArticlesMap.values()],
		getCategoryArticlesCursor: state => Array.from(state.categoryArticlesMap.values()).slice(-1)[0],
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
		},
		GetCategoryWithArticles(data: { take: number; cursor?: { id: number } }) {
			this.isCategoryArticlesMapLoading = true
			this.isCategoryArticlesHasMore = true
			const { take, cursor } = data
			if (cursor) {
				const { fetchMore, onError } = useQuery(getMoreCategoriesWithPosts, {
					orderBy: [
						{
							id: SortOrder.Asc
						}
					],
					cursor: {
						id: cursor.id
					},
					skip: 1,
					take: take + 1,
					categoriesOnPostOrderBy: [
						{
							postId: {
								nulls: NullsOrder.Last,
								sort: SortOrder.Desc
							}
						}
					],
					categoriesOnPostTake: 5
				})
				fetchMore({
					updateQuery: (prev, { fetchMoreResult }) => {
						if (!fetchMoreResult) {
							return prev
						}
						const categories = fetchMoreResult.categories || []
						if (!categories.length) {
							return prev
						}
						const hasMore = categories.length === take + 1
						this.isCategoryArticlesHasMore = hasMore
						categories.slice(0, hasMore ? -1 : undefined).forEach(item => {
							this.categoryArticlesMap.set(item.id, categoriesToCategoryArticle(item))
						})
						return {
							...prev,
							categories: prev.categories.concat(categories)
						}
					}
				})
				onError(() => {
					this.isCategoryArticlesMapLoading = false
					this.isCategoryArticlesHasMore = true
				})
			} else {
				const { onResult, onError } = useQuery(getCategoriesWithPosts, {
					orderBy: [
						{
							id: SortOrder.Asc
						}
					],
					take: take + 1,
					categoriesOnPostOrderBy: [
						{
							postId: {
								nulls: NullsOrder.Last,
								sort: SortOrder.Desc
							}
						}
					],
					categoriesOnPostTake: 5
				})
				onResult(result => {
					if (result.networkStatus !== NetworkStatus.ready) {
						return
					}
					this.isCategoryArticlesMapLoading = false
					const categories = result.data?.categories || []
					if (!categories.length) {
						this.isCategoryArticlesHasMore = false
						return
					}
					const hasMore = categories.length === take + 1
					this.isCategoryArticlesHasMore = hasMore
					categories.slice(0, hasMore ? -1 : undefined).forEach(item => {
						this.categoryArticlesMap.set(item.id, categoriesToCategoryArticle(item))
					})
				})
				onError(() => {
					this.isCategoryArticlesMapLoading = false
					this.isCategoryArticlesHasMore = true
				})
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
		}
	}
})
