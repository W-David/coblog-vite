<template>
	<div class="category-page">
		<div class="category-article-list">
			<el-skeleton
				:loading="isLoadingMore"
				animated
				:count="take">
				<template #template>
					<div class="skeleton-item">
						<div class="name-container">
							<el-skeleton-item
								variant="text"
								class="name-content"></el-skeleton-item>
							<el-skeleton-item
								variant="text"
								class="info-content"></el-skeleton-item>
						</div>
						<div class="article-list">
							<div class="article-card">
								<el-skeleton-item
									variant="text"
									class="title-content-1"></el-skeleton-item>
								<el-skeleton-item
									variant="text"
									class="time-content-1"></el-skeleton-item>
							</div>
							<div class="article-card">
								<el-skeleton-item
									variant="text"
									class="title-content-2"></el-skeleton-item>
								<el-skeleton-item
									variant="text"
									class="time-content-2"></el-skeleton-item>
							</div>
						</div>
					</div>
				</template>
				<template #default>
					<div
						v-for="category in categoryArticles"
						:key="category.id"
						class="category-article-item">
						<category-card
							:category="category"
							:is-active="isChecked(category.id)"></category-card>
					</div>
				</template>
			</el-skeleton>
		</div>
		<page-load
			v-show="categoryArticles?.length"
			:is-loading-more="isLoadingMore"
			:has-more="hasMore"
			@on-load-more="onLoadMore"></page-load>
	</div>
</template>

<script lang="ts" setup>
definePage({
	name: 'category',
	meta: {
		transitionName: 'fade'
	}
})
const categoryStore = useCategory()
const route = useRoute<'category'>()
const articleId = route.params.id ? +route.params.id : 0
const checkedIds = computed(() => categoryStore.getCheckedCateIds)
const isChecked = (id: number) => checkedIds.value.includes(id)
const isLoadingMore = computed(() => categoryStore.isCategoryArticlesMapLoading)
const categoryArticles = computed(() => categoryStore.getCategoryArticles())
const cursor = computed(() => categoryStore.getCategoryArticlesCursor)
const hasMore = computed(() => categoryStore.isCategoryArticlesHasMore)
const take = 10

// useReachBottom(onLoadMore)
const onLoadMore = () => {
	if (!hasMore.value) return
	categoryStore.GetCategoryWithArticles({ take, cursor: cursor.value })
}

const initPage = () => {
	if (articleId) {
		categoryStore.checkedCateIds.splice(0, categoryStore.checkedCateIds.length)
	}
	categoryStore.GetCategoryWithArticles({ take, cursor: undefined })
}

initPage()
</script>

<style lang="scss" scoped>
.category-page {
	@include layout(100%, auto, 0 0 $main-margin 0, 0);
	z-index: 1000;
	.category-article-list {
		.skeleton-item {
			@include layout(100%, auto, 0 0 $main-margin 0, 16px);
			@include box-shadow(0 0 16px 0 rgba(0, 0, 0, 0.1));
			@include bg-color(#fcfcfc, #1f1f1f);
			border-radius: 8px;
			.name-container {
				@include layout(auto, auto, 0 8px 8px 8px, 0);
				@include flex-box(row, space-between, center, wrap);
				.name-content {
					width: 64px;
					height: 30px;
				}
				.info-content {
					width: 180px;
					height: 24px;
				}
			}
			.article-list {
				@include layout(100%, auto, 0, 0);
				.article-card {
					@include layout(auto, auto, 0 8px, 8px);
					@include flex-box(row, space-between, center);
					.title-content-1 {
						width: 50%;
						height: 20px;
					}
					.time-content-1 {
						width: 120px;
						height: 18px;
					}
					.title-content-2 {
						width: 40%;
						height: 20px;
					}
					.time-content-2 {
						width: 140px;
						height: 18px;
					}
				}
			}
		}
		.category-article-item {
			margin-bottom: $main-margin;
		}
	}
}
</style>
