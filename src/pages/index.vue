<template>
	<div class="home-page">
		<div class="main-content-list">
			<el-skeleton
				:loading="loading"
				animated
				:count="queryParams.pageSize || 5">
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
						v-for="article in articlesRef"
						:key="article.id"
						class="main-article-container">
						<article-card :article="article"></article-card>
					</div>
				</template>
			</el-skeleton>
			<div class="main-pagination-container">
				<pagination
					v-show="totalRef > 0"
					v-model:page="queryParams.pageNum"
					v-model:limit="queryParams.pageSize"
					:total="totalRef"
					@pagination="getList" />
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
const articleStore = useArticle()
const articlesRef = ref<Article[]>([])
const totalRef = ref(0)
const queryParams = reactive({
	pageNum: 1,
	pageSize: 5
})
const loading = ref(true)

const getList = async () => {
	const [articles, total] = await articleStore.GetArticles(queryParams)
	articlesRef.value = articles || []
	totalRef.value = total || 0
	loading.value = false
}
const init = () => {
	articleStore.articleMap.clear()
	getList()
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
