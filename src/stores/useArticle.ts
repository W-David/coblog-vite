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
	} => ({
		articleMap: new Map(),
		articleArchive: [],
		articlesRecent: [],
		articlesHot: [],
		articleCurList: [],
		cataLog: [],
		isArticleCurListLoading: false,
		isArticleDetailLoading: true
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
			const { cursor, take } = data
			this.isArticleCurListLoading = true
			const { onResult, onError } = useQuery(posts, {
				cursor: cursor
					? {
							id: cursor.id
					  }
					: undefined,
				take
			})
			onResult(result => {
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
		},
		async GetArticlesRecent(data: { take: number }) {
			const { onResult } = useQuery(posts, {
				take: 5,
				orderBy: [
					{
						updatedAt: SortOrder.Desc
					}
				]
			})
			onResult(result => {
				const posts = result.data.posts
				this.articlesRecent = posts.slice(0).map(post => postToArticle(post))
			})
			const res = await listByTimeArticle(data)
			if (res.data.code === 200 && res.data.data) {
				const articles = res.data.data ?? []
				this.articlesRecent = articles.slice(0)
				return articles
			} else {
				return []
			}
		},
		async GetArticlesHot(data: any) {
			const res = await listByFavoArticle(data)
			if (res.data.code === 200 && res.data.data) {
				const articles = res.data.data ?? []
				this.articlesHot = articles.slice(0)
				return articles
			} else {
				return []
			}
		},
		async FavoriteArticle(data: any) {
			return favoriteArticle(data)
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
