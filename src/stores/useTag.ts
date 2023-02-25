export default defineStore('useTag', {
	state: (): {
		tagMap: Map<number, Tag>
		tagArticlesMap: Map<number, TagArticle>
		checkedTagIds: number[]
	} => ({
		tagMap: new Map(),
		tagArticlesMap: new Map(),
		checkedTagIds: [],
	}),
	getters: {
		getTagById: (state) => (id: number) => state.tagMap.get(id),
		getTagArticleById: (state) => (id: number) => state.tagArticlesMap.get(id),
		getTagList: (state) => () => [...state.tagMap.values()],
		getTagArticles: (state) => () => [...state.tagArticlesMap.values()],
		getCheckedTagIds: (state) => state.checkedTagIds,
	},
	actions: {
		async CreateTag(params = {}) {
			const res = await createTag(params)
			if (res.data.code === 200 && res.data.data) {
				const tag = res.data.data
				this.tagMap.set(tag.id, cloneLoop(tag))
				this.tagArticlesMap.set(tag.id, { ...cloneLoop(tag), articles: [] })
				return tag
			} else {
				return null
			}
		},
		async GetTags(params = {}): Promise<[Tag[], number]> {
			const res = await listTag(params)
			if (res.data.code === 200 && res.data.data) {
				const tags = res.data.data.rows || []
				const total = res.data.data.count || 0
				tags.forEach((item) => {
					this.tagMap.set(item.id, cloneLoop(item))
				})
				return [tags, total]
			} else {
				return [[], 0]
			}
		},
		async GetTagArticles(data = {}): Promise<[TagArticle[], number]> {
			const res = await listTagArticles(data)
			if (res.data.code === 200 && res.data.data) {
				const tags = res.data.data.rows || []
				const total = res.data.data.count || 0
				tags.forEach((item) => {
					this.tagArticlesMap.set(item.id, cloneLoop(item))
				})
				return [tags, total]
			} else {
				return [[], 0]
			}
		},
		async GetTag(tagId: number) {
			const curTag = this.tagMap.get(tagId)
			if (curTag?.name) {
				return Promise.resolve(curTag)
			}
			const res = await detailTag(tagId)
			if (res.data.code === 200 && res.data.data) {
				const tag = res.data.data
				this.tagMap.set(tag.id, cloneLoop(tag))
				return tag
			} else {
				return null
			}
		},
		async DelTag(tagId: number) {
			const res = await deleteTag(tagId)
			if (res.data.code === 200 && res.data.data) {
				const tag = res.data.data
				this.tagMap.delete(tag.id)
				this.tagArticlesMap.delete(tag.id)
				return tag
			} else {
				return null
			}
		},
	},
})
