<template>
	<div class="category-page">
		<div class="category-article-list">
			<div
				v-for="category in categoryArticles"
				:key="category.id"
				class="category-article-item"
			>
				<category-card
					:category="category"
					:is-active="isChecked(category.id)"
				></category-card>
			</div>
		</div>
		<page-load
			v-show="categoryArticles?.length"
			:is-loading-more="isLoadingMore"
			:has-more="hasMore"
			@on-load-more="onLoadMore"
		></page-load>
	</div>
</template>

<script lang="ts" setup>
definePage({
	name: 'category',
	meta: {
		transitionName: 'fade',
	},
})
const categoryStore = useCategory()
const route = useRoute<'category'>()
const articleId = route.params.id ? +route.params.id : 0
const checkedIds = computed(() => categoryStore.getCheckedCateIds)
const isChecked = (id: number) => checkedIds.value.includes(id)
const hasMore = ref(true)
const isLoadingMore = ref(false)
const queryParams = reactive({ pageNum: 1, pageSize: 5 })
const categoryArticles = computed(() => categoryStore.getCategoryArticles())

const getCategoryArticles = async (queryParams: any) => {
	if (!hasMore.value) return
	const [list, total] = await categoryStore.GetCategoryArticles(queryParams)
	hasMore.value =
		list &&
		list.length > 0 &&
		queryParams.pageNum * queryParams.pageSize < total
	return list
}

// useReachBottom(onLoadMore)
const onLoadMore = async () => {
	isLoadingMore.value = true
	const list = await getCategoryArticles(
		Object.assign(queryParams, { pageNum: queryParams.pageNum + 1 })
	)
	if (list?.length) {
		queryParams.pageNum += 1
	}
	isLoadingMore.value = false
}

const initPage = () => {
	if (articleId) {
		categoryStore.checkedCateIds.splice(0, categoryStore.checkedCateIds.length)
	}
	getCategoryArticles(queryParams)
}

initPage()
</script>

<style lang="scss" scoped>
.category-page {
	@include layout(100%, auto, 0 0 $main-margin 0, 0);
	z-index: 1000;
	.category-article-list {
		.category-article-item {
			margin-bottom: $main-margin;
		}
	}
}
</style>
