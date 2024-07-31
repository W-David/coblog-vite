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
		getTagArticlesCursor: state => Array.from(state.tagArticlesMap.values()).slice(-1)[0],
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
					if (result.errors) {
						return
					}
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
				if (result.networkStatus !== NetworkStatus.ready) {
					return
				}
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
		GetTagWithArticles(data: { take: number; cursor?: TagArticle }) {
			this.isTagArticlesMapLoading = true
			const { take, cursor } = data
			const { onResult, onError } = useQuery(getTagsWithPosts, {
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
				take,
				tagsOnPostOrderBy: [
					{
						postId: SortOrder.Asc
					}
				],
				tagsOnPostTake: 5
			})
			onResult(result => {
				if (result.networkStatus !== NetworkStatus.ready) {
					return
				}
				this.isTagArticlesMapLoading = false
				const tags = result.data?.tags || []
				if (!tags.length) {
					return
				}
				tags.forEach(item => {
					this.tagArticlesMap.set(item.id, tagsToTagArticle(item))
				})
			})
			onError(() => {
				this.isTagArticlesMapLoading = false
			})
		},
		DelTag(tagId: number) {
			const { mutate, onDone } = useMutation(deleteOneTag)
			mutate({
				where: {
					id: tagId
				}
			})
			onDone(result => {
				if (result.errors) {
					return
				}
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
