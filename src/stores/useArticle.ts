import pinia from '~/modules/pinia'
const adminStore = useAdmin(pinia)

export default defineStore('useArticle', {
	state: (): {
		articleMap: Map<number, Article>
		articleArchive: ArticleArchive[]
		articlesRecent: ArticleRecent[]
		articlesHot: ArticleHot[]
		cataLog: TocItem[]
		isArticleLoading: boolean
	} => ({
		articleMap: new Map(),
		articleArchive: [],
		articlesRecent: [],
		articlesHot: [],
		cataLog: [],
		isArticleLoading: true
	}),
	getters: {
		getArticleMap: state => () => cloneLoop(state.articleMap),
		getArticleArchive: state => cloneLoop(state.articleArchive),
		getArticleById: state => (id: number) => state.articleMap.get(id),
		getArticleList: state => () => [...state.articleMap.values()],
		getArticlesRecent: state => cloneLoop(state.articlesRecent),
		getArticlesHot: state => cloneLoop(state.articlesHot)
	},
	actions: {
		async GetArticles(data: any): Promise<[Article[], number]> {
			const res = await listArticle(data)
			if (res.data.code === 200 && res.data.data) {
				const articles = res.data.data.rows || []
				const total = res.data.data.count || 0
				articles.forEach(article => {
					this.articleMap.set(article.id, cloneLoop(article))
				})
				return [articles, total]
			} else {
				return [[], 0]
			}
		},
		async GetArticlesRecent(data: any) {
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
		async GetArticle(articleId: number) {
			const isAdminLogin = adminStore.isLogin
			const res = isAdminLogin ? await detailArticle(articleId) : await noAuthDetailArticle(articleId)
			if (res.data.code === 200 && res.data.data) {
				const article = res.data.data
				this.articleMap.set(article.id, cloneLoop(article))
				return article
			} else {
				return null
			}
		},
		async DelArticle(articleId: number) {
			const res = await deleteArticle(articleId)
			if (res.data.code === 200 && res.data.data) {
				const article = res.data.data
				this.articleMap.delete(article.id)
				return article
			} else {
				return null
			}
		}
	}
})
