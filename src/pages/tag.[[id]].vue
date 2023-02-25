<template>
	<div class="tag-page">
		<div class="tag-article-list">
			<div v-for="tag in tagArticles" :key="tag.id" class="tag-aritlce-item">
				<tag-card :tag="tag" :is-active="isChecked(tag.id)"></tag-card>
			</div>
		</div>
		<page-load
			v-show="tagArticles && tagArticles.length"
			:is-loading-more="isLoadingMore"
			:has-more="hasMore"
			@on-load-more="onLoadMore"
		></page-load>
	</div>
</template>

<script lang="ts" setup>
definePage({
	name: 'tag',
	meta: {
		transitionName: 'fade',
	},
})
const tagStore = useTag()
const route = useRoute<'tag'>()
const articleId = route.params.id ? +route.params.id : 0
const checkedIds = computed(() => tagStore.getCheckedTagIds)
const isChecked = (id: number) => checkedIds.value.includes(id)
const hasMore = ref(true)
const isLoadingMore = ref(false)
const queryParams = reactive({ pageNum: 1, pageSize: 5 })
const tagArticles = computed(() => tagStore.getTagArticles())

const getTagArticles = async (queryParams: any) => {
	if (!hasMore.value) return
	const [list, total] = await tagStore.GetTagArticles(queryParams)
	hasMore.value =
		list &&
		list.length > 0 &&
		queryParams.pageNum * queryParams.pageSize < total
	return list
}

// useReachBottom(onLoadMore)
const onLoadMore = async () => {
	isLoadingMore.value = true
	const list = await getTagArticles({
		...queryParams,
		pageNum: queryParams.pageNum + 1,
	})
	isLoadingMore.value = false
	if (list?.length) {
		queryParams.pageNum += 1
	}
}

const initPage = () => {
	if (articleId) {
		tagStore.checkedTagIds.splice(0, tagStore.checkedTagIds.length)
	}
	getTagArticles(queryParams)
}

initPage()
</script>

<style lang="scss" scoped>
.tag-page {
	@include layout(100%, auto, 0 0 $main-margin 0, 0);
	z-index: 1000;
	.tag-article-list {
		.tag-aritlce-item {
			margin-bottom: $main-margin;
		}
	}
}
</style>
