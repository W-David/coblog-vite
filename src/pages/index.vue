<template>
	<div class="home-page">
		<div class="main-content-list">
			<div
				v-for="article in articlesRef"
				:key="article.id"
				class="main-article-container"
			>
				<article-card :article="article"></article-card>
			</div>
			<div class="main-pagination-container">
				<pagination
					v-show="totalRef > 0"
					v-model:page="queryParams.pageNum"
					v-model:limit="queryParams.pageSize"
					:total="totalRef"
					@pagination="getList"
				/>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
definePage({
	name: '/',
	meta: {
		transitionName: 'fade',
	},
})
const articleStore = useArticle()
const articlesRef = ref<Article[]>([])
const totalRef = ref(0)
const queryParams = reactive({
	pageNum: 1,
	pageSize: 10,
})

const getList = async () => {
	const [articles, total] = await articleStore.GetArticles(queryParams)
	articlesRef.value = articles || []
	totalRef.value = total || 0
}
onMounted(() => {
	articleStore.articleMap.clear()
	Promise.all([getList()])
})
</script>

<style lang="scss" scoped>
.home-page {
	@include layout(100%, auto, 0 0 $main-margin 0, 0);
	z-index: 1000;
	.main-content-list {
		@include flex-box(column, flex-start, center);
		.main-article-container {
			@include layout(100%, auto, 0 0 $main-margin 0, 0);
		}
		.main-pagination-container {
			@include layout(100%, auto, $main-margin, 0);
			@include flex-box(row, center, center);
		}
	}
}
</style>
