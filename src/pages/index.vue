<template>
	<div class="home-page">
		<div class="main-content-list">
			<el-skeleton
				:loading="isLoading && !queryParams.cursor"
				animated
				:count="queryParams.take || 5">
				<template #template>
					<div class="skeleton-item">
						<el-skeleton-item
							variant="image"
							class="banner"></el-skeleton-item>
						<div class="title-container">
							<el-skeleton-item
								variant="h1"
								class="title"></el-skeleton-item>
						</div>
						<div class="ct-container">
							<el-skeleton-item
								variant="text"
								class="ct-1"></el-skeleton-item>
							<el-skeleton-item
								variant="text"
								class="ct-2"></el-skeleton-item>
						</div>
						<div class="content-container">
							<el-skeleton-item
								variant="p"
								class="content-1"></el-skeleton-item>
							<el-skeleton-item
								variant="p"
								class="content-2"></el-skeleton-item>
						</div>
						<div class="description-container">
							<el-skeleton-item
								variant="text"
								class="time"></el-skeleton-item>
							<el-skeleton-item
								variant="button"
								class="more"></el-skeleton-item>
						</div>
					</div>
				</template>
				<template #default>
					<div
						v-for="article in articles"
						:key="article.id"
						class="main-article-container">
						<article-card :article="article"></article-card>
					</div>
				</template>
			</el-skeleton>
			<div class="main-pagination-container">
				<page-load
					v-show="articles && articles.length > 0"
					:is-loading-more="isLoading"
					:has-more="hasMore"
					@on-load-more="onLoadMore"></page-load>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
definePage({
	name: '/',
	meta: {
		transitionName: 'fade'
	}
})
const categoryStore = useCategory()
const tagStore = useTag()
const articleStore = useArticle()
const articles = computed(() => articleStore.getArticleList())
const curArticles = computed(() => articleStore.getArticleCurList)
const isLoading = computed(() => articleStore.isArticleCurListLoading)
const queryParams = reactive({
	take: 5,
	cursor: articles.value.length ? articles.value.slice(-1)[0] : undefined
})

const hasMore = computed(() => curArticles.value.length === queryParams.take)

const onLoadMore = () => {
	articleStore.GetArticles(queryParams)
}

const init = () => {
	articleStore.articleMap.clear()
	articleStore.GetArticles({
		take: 2,
		cursor: undefined
	})
	articleStore.GetArticlesRecent({ take: 5 })
	articleStore.GetArticlesHot({ take: 8 })

	// 加载分类列表[无关联文章数据]
	categoryStore.checkedCateIds.splice(0, categoryStore.checkedCateIds.length)
	categoryStore.GetCategories({ take: 12, cursor: undefined })

	// 加载标签列表[无关联文章数据]
	tagStore.checkedTagIds.splice(0, tagStore.checkedTagIds.length)
	tagStore.GetTags({ take: 12, cursor: undefined })
}
init()
</script>

<style lang="scss" scoped>
.home-page {
	@include layout(100%, auto, 0 0 $main-margin 0, 0);
	z-index: 1000;
	.main-content-list {
		@include flex-box(column, flex-start, center);

		.skeleton-item {
			@include layout(100%, auto, 0 0 $main-margin 0, 0);
			background-color: var(--el-bg-color);
			box-shadow: var(--el-box-shadow);
			.banner {
				@include layout(100%, 280px, 0, 0);
				border-radius: 6px 6px 0 0;
			}
			.title-container {
				@include layout(100%, auto, 16px 0 0 0, 8px);
				@include flex-box(row, center, center);
				.title {
					@include layout(50%, 32px, 0, 0);
				}
			}
			.ct-container {
				@include layout(auto, auto, 0 32px, 8px 0);
				@include flex-box(row, center, center, wrap);
				.ct-1 {
					@include layout(80px, 16px, 0 8px, 0);
					border-radius: 8px;
				}
				.ct-2 {
					@include layout(64px, 16px, 0 8px, 0);
					border-radius: 8px;
				}
			}
			.content-container {
				@include layout(auto, auto, 0, 8px 32px);
				line-height: 1.8;
				.content-1 {
					width: calc(100% - 32px);
					height: 18px;
					margin-left: 32px;
				}
				.content-2 {
					height: 18px;
					width: 100%;
				}
			}

			.description-container {
				@include layout(100%, auto, 0, 0 16px 12px 16px);
				@include flex-box(row, space-between);
				.time {
					width: 85px;
					height: 32px;
				}
				.more {
					width: 72px;
					height: 32px;
				}
			}
		}
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
