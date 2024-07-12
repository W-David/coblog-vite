import { SortOrder } from '~/graphql/generated/graphql'

export default defineStore('useTag', {
	state: (): {
		tagMap: Map<number, Tag>
		tagArticlesMap: Map<number, TagArticle>
		checkedTagIds: number[]
		isTagMapLoading: boolean
		isTagArticlesMapLoading: boolean
	} => ({
		tagMap: new Map(),
		tagArticlesMap: new Map(),
		checkedTagIds: [],
		isTagMapLoading: false,
		isTagArticlesMapLoading: false
	}),
	getters: {
		getTagById: state => (id: number) => state.tagMap.get(id),
		getTagArticleById: state => (id: number) => state.tagArticlesMap.get(id),
		getTagList: state => () => [...state.tagMap.values()],
		getTagArticles: state => () => [...state.tagArticlesMap.values()],
		getCheckedTagIds: state => state.checkedTagIds
	},
	actions: {
		async CreateTag(params: { name: string }) {
			return new Promise<Tag>((resolve, reject) => {
				const { mutate, onDone, onError } = useMutation(createOneTag)
				mutate({
					data: {
						name: params.name
					}
				})
				onDone(result => {
					const tag = result.data?.createOneTag
					if (!tag) {
						return
					}
					this.tagMap.set(tag.id, cloneLoop(tag))
					this.tagArticlesMap.set(tag.id, {
						...cloneLoop(tag),
						articles: []
					})
					resolve(tag)
				})
				onError(error => {
					reject(error)
				})
			})
		},
		GetTags(data: { take: number; cursor?: Tag }) {
			this.isTagMapLoading = true
			const { take, cursor } = data
			const { onResult, onError } = useQuery(tags, {
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
				this.isTagMapLoading = false
				const tags = result.data?.tags || []
				if (!tags.length) {
					return
				}
				tags.forEach(item => {
					this.tagMap.set(item.id, cloneLoop(item))
				})
			})
			onError(() => {
				this.isTagMapLoading = false
			})
		},
		async GetTagArticles(data: { pageNum: number; pageSize: number }): Promise<[TagArticle[], number]> {
			const res = await listTagArticles(data)
			if (res.data.code === 200 && res.data.data) {
				const tags = res.data.data.rows || []
				const total = res.data.data.count || 0
				tags.forEach(item => {
					this.tagArticlesMap.set(item.id, cloneLoop(item))
				})
				return [tags, total]
			} else {
				return [[], 0]
			}
		},
		DelTag(tagId: number) {
			const { mutate, onDone } = useMutation(deleteOneTag)
			mutate({
				where: {
					id: tagId
				}
			})
			onDone(result => {
				const tag = result.data?.deleteOneTag
				if (!tag) {
					return
				}
				this.tagMap.delete(tag.id)
				this.tagArticlesMap.delete(tag.id)
			})
		}
	}
})
