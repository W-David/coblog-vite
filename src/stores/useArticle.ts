import { SortOrder } from '~/graphql/generated/graphql'
import { Format } from '~/utils/format'

export default defineStore('useArticle', {
	state: (): {
		articleMap: Map<number, Article>
		articleArchive: ArticleArchive[]
		articleArchiveCurList: Article[]
		articlesRecent: ArticleRecent[]
		articlesHot: ArticleHot[]
		articleCurList: Article[]
		cataLog: TocItem[]
		isArticleCurListLoading: boolean
		isArticleDetailLoading: boolean
		isArticleRecentLoading: boolean
		isArticleHotLoading: boolean
		isArticleArchiveLoading: boolean
		isFavoriteLoading: boolean
	} => ({
		articleMap: new Map(),
		articleArchive: [],
		articleArchiveCurList: [],
		articlesRecent: [],
		articlesHot: [],
		articleCurList: [],
		cataLog: [],
		isArticleCurListLoading: false,
		isArticleDetailLoading: false,
		isArticleRecentLoading: false,
		isArticleHotLoading: false,
		isArticleArchiveLoading: false,
		isFavoriteLoading: false
	}),
	getters: {
		getArticleCurList: state => cloneLoop(state.articleCurList),
		getArticleMap: state => () => cloneLoop(state.articleMap),
		getArticleArchive: state => (format: Format) => {
			const articleArchiveCurList = state.articleArchiveCurList
			const formatedArticles = timeLineArticles2FormatedArticles(articleArchiveCurList, format)
			const articleArchive = articles2Archive(formatedArticles, format)
			state.articleArchive = ([] as ArticleArchive[]).concat(articleArchive)
			return cloneLoop(articleArchive)
		},
		getArticleArchiveCurList: state => cloneLoop(state.articleArchiveCurList),
		getArticleById: state => (id: number) => state.articleMap.get(id),
		getArticleList: state => () => [...state.articleMap.values()],
		getArticlesRecent: state => cloneLoop(state.articlesRecent),
		getArticlesHot: state => cloneLoop(state.articlesHot)
	},
	actions: {
		GetArticles(data: { cursor?: Article; take: number }) {
			this.isArticleCurListLoading = true
			const { cursor, take } = data
			onApolloContext(() => {
				const { onResult, onError } = useQuery(posts, {
					cursor: cursor
						? {
								updatedAt: {
									equals: cursor.updatedAt
								}
						  }
						: undefined,
					skip: cursor ? 1 : undefined,
					take,
					orderBy: [
						{
							updatedAt: SortOrder.Desc
						}
					]
				})
				onResult(result => {
					if (result.networkStatus !== NetworkStatus.ready) {
						return
					}
					const posts = result.data.posts
					this.isArticleCurListLoading = false
					this.articleCurList = posts.slice(0).map(post => postToArticle(post))
					posts.forEach(article => {
						const post = cloneLoop(article)
						this.articleMap.set(article.id, postToArticle(post))
					})
				})
				onError(() => {
					this.isArticleCurListLoading = false
				})
			})
		},
		GetArticlesRecent(data: { take: number }) {
			this.isArticleRecentLoading = true
			const { take } = data
			onApolloContext(() => {
				const { onResult, onError } = useQuery(posts, {
					take,
					orderBy: [
						{
							updatedAt: SortOrder.Desc
						}
					]
				})
				onResult(result => {
					if (result.networkStatus !== NetworkStatus.ready) {
						return
					}
					this.isArticleRecentLoading = false
					const posts = result.data.posts
					this.articlesRecent = posts.slice(0).map(post => postToArticle(post))
				})
				onError(() => {
					this.isArticleRecentLoading = false
				})
			})
		},
		GetArticlesHot(data: { take: number }) {
			this.isArticleHotLoading = true
			const { take } = data
			onApolloContext(() => {
				const { onResult, onError } = useQuery(posts, {
					take,
					orderBy: [
						{
							favoNum: SortOrder.Desc
						}
					]
				})
				onResult(result => {
					if (result.networkStatus !== NetworkStatus.ready) {
						return
					}
					this.isArticleHotLoading = false
					const posts = result.data.posts
					this.articlesHot = posts.slice(0).map(post => postToArticle(post))
				})
				onError(() => {
					this.isArticleHotLoading = false
				})
			})
		},
		FavoriteArticle(data: { id: number; isFavorite: boolean }) {
			this.isFavoriteLoading = true
			const { id, isFavorite } = data
			onApolloContext(() => {
				const { mutate, onDone, onError } = useMutation(updateOnePost)
				mutate({
					where: { id },
					data: {
						favoNum: {
							increment: isFavorite ? 1 : undefined,
							decrement: !isFavorite ? 1 : undefined
						}
					}
				})
				onDone(result => {
					if (result.errors) {
						return
					}
					const article = this.articleMap.get(id)
					if (!article) return
					const beforeFavoritedNum = article.favoritedNum || 0
					const afterFavoritedNum = isFavorite ? beforeFavoritedNum + 1 : Math.max(beforeFavoritedNum - 1, 0)
					this.articleMap.set(id, { ...article, favoritedNum: afterFavoritedNum })
					this.isFavoriteLoading = false
				})
				onError(() => {
					this.isFavoriteLoading = false
				})
			})
		},
		GetArticleArchive(data: { cursor?: Article; take: number }) {
			this.isArticleArchiveLoading = true
			const { cursor, take } = data
			onApolloContext(() => {
				const { onResult, onError } = useQuery(posts, {
					cursor: cursor
						? {
								updatedAt: {
									equals: cursor.updatedAt
								}
						  }
						: undefined,
					skip: cursor ? 1 : undefined,
					take,
					orderBy: [
						{
							updatedAt: SortOrder.Desc
						}
					]
				})
				onResult(result => {
					if (result.networkStatus !== NetworkStatus.ready) {
						return
					}
					this.isArticleArchiveLoading = false
					const posts = result.data.posts
					const newPosts = posts.slice(0).map(post => postToArticle(post))
					this.articleArchiveCurList = this.articleArchiveCurList.concat(newPosts)
				})
				onError(() => {
					this.isArticleArchiveLoading = false
				})
			})
		},
		GetArticle(articleId: number) {
			this.isArticleDetailLoading = true
			onApolloContext(() => {
				const { onResult, onError } = useQuery(getPost, {
					where: {
						id: articleId
					}
				})
				onResult(result => {
					if (result.networkStatus !== NetworkStatus.ready) {
						return
					}
					this.isArticleDetailLoading = false
					const post = result.data.getPost
					if (!post) {
						return
					}
					this.articleMap.set(post.id, postToArticle(post))
				})
				onError(() => {
					this.isArticleDetailLoading = false
				})
			})
		},
		DelArticle(articleId: number) {
			onApolloContext(() => {
				const { mutate, onDone } = useMutation(deleteOnePost)
				mutate({
					where: {
						id: articleId
					}
				})
				onDone(result => {
					if (result.errors) {
						return
					}
					this.articleMap.delete(articleId)
				})
			})
		}
	}
})
