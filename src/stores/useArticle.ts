import { SortOrder } from '~/graphql/generated/graphql'

export default defineStore('useArticle', {
	state: (): {
		articleMap: Map<number, Article>
		articleArchive: ArticleArchive[]
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
		getArticleArchive: state => cloneLoop(state.articleArchive),
		getArticleById: state => (id: number) => state.articleMap.get(id),
		getArticleList: state => () => [...state.articleMap.values()],
		getArticlesRecent: state => cloneLoop(state.articlesRecent),
		getArticlesHot: state => cloneLoop(state.articlesHot)
	},
	actions: {
		GetArticles(data: { cursor?: Article; take: number }) {
			this.isArticleCurListLoading = true
			const { cursor, take } = data
			const { onResult, onError } = useQuery(posts, {
				cursor: cursor
					? {
							id: cursor.id
					  }
					: undefined,
				take
			})
			onResult(result => {
				this.isArticleCurListLoading = false
				const posts = result.data.posts
				this.articleCurList = posts.slice(0).map(post => postToArticle(post))
				posts.forEach(article => {
					const post = cloneLoop(article)
					this.articleMap.set(article.id, postToArticle(post))
				})
			})
			onError(() => {
				this.isArticleCurListLoading = false
			})
		},
		GetArticlesRecent(data: { take: number }) {
			this.isArticleRecentLoading = true
			const { take } = data
			const { onResult, onError } = useQuery(posts, {
				take,
				orderBy: [
					{
						updatedAt: SortOrder.Desc
					}
				]
			})
			onResult(result => {
				this.isArticleRecentLoading = false
				const posts = result.data.posts
				this.articlesRecent = posts.slice(0).map(post => postToArticle(post))
			})
			onError(() => {
				this.isArticleRecentLoading = false
			})
		},
		GetArticlesHot(data: { take: number }) {
			this.isArticleHotLoading = true
			const { take } = data
			const { onResult, onError } = useQuery(posts, {
				take,
				orderBy: [
					{
						favoNum: SortOrder.Desc
					}
				]
			})
			onResult(result => {
				this.isArticleHotLoading = false
				const posts = result.data.posts
				this.articlesHot = posts.slice(0).map(post => postToArticle(post))
			})
			onError(() => {
				this.isArticleHotLoading = false
			})
		},
		FavoriteArticle(data: { id: number; isFavorite: boolean }) {
			this.isFavoriteLoading = true
			const { id, isFavorite } = data
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
			onDone(() => {
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
		},
		async GetArticleArchive(data: any): Promise<[ArticleArchive[], number]> {
			const res = await listArchive(data)
			if (res.data.code === 200 && res.data.data) {
				const rawArchive = res.data.data.rows || []
				const total = res.data.data.count || 0
				const articleArchive = articles2Archive(rawArchive)
				if (this.articleArchive.length) {
					this.articleArchive = concatArchive(this.articleArchive, articleArchive)
				} else {
					this.articleArchive = ([] as ArticleArchive[]).concat(articleArchive)
				}
				return [articleArchive, total]
			} else {
				return [[], 0]
			}
		},
		GetArticle(articleId: number) {
			this.isArticleDetailLoading = true
			const { onResult, onError } = useQuery(getPost, {
				where: {
					id: articleId
				}
			})
			onResult(result => {
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
		},
		DelArticle(articleId: number) {
			const { mutate, onDone } = useMutation(deleteOnePost)
			mutate({
				where: {
					id: articleId
				}
			})
			onDone(() => {
				this.articleMap.delete(articleId)
			})
		}
	}
})
