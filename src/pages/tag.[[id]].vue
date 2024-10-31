<template>
	<div class="tag-page">
		<div class="tag-article-list">
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
						v-for="tag in tagArticles"
						:key="tag.id"
						class="tag-aritlce-item">
						<tag-card
							:tag="tag"
							:is-active="isChecked(tag.id)"></tag-card>
					</div>
				</template>
			</el-skeleton>
		</div>
		<page-load
			v-show="tagArticles && tagArticles.length"
			:is-loading-more="isLoadingMore"
			:has-more="hasMore"
			@on-load-more="onLoadMore"></page-load>
	</div>
</template>

<script lang="ts" setup>
definePage({
	name: 'tag',
	meta: {
		transitionName: 'fade'
	}
})
const take = ref(6)
const tagStore = useTag()
const route = useRoute<'tag'>()
const articleId = route.params.id ? +route.params.id : 0
const checkedIds = computed(() => tagStore.getCheckedTagIds)
const isChecked = (id: number) => checkedIds.value.includes(id)
const isLoadingMore = computed(() => tagStore.isTagArticlesMapLoading)
const tagArticles = computed(() => tagStore.getTagArticles())
const cursor = computed(() => tagStore.getTagArticlesCursor)
const hasMore = computed(() => tagStore.getCurTagArticleList.length > take.value)

const onLoadMore = () => {
	if (!hasMore.value) return
	tagStore.GetTagWithArticles({ take: take.value, cursor: cursor.value })
}

const initPage = () => {
	if (articleId) {
		tagStore.checkedTagIds.splice(0, tagStore.checkedTagIds.length)
	}
	tagStore.GetTagWithArticles({ take: take.value, cursor: undefined })
}

initPage()
</script>

<style lang="scss" scoped>
.tag-page {
	@include layout(100%, auto, 0 0 $main-margin 0, 0);
	z-index: 1000;
	.tag-article-list {
		.skeleton-item {
			@include layout(100%, auto, 0 0 $main-margin 0, 16px);
			@include box-shadow(0 0 16px 0 rgba(0, 0, 0, 0.1));
			@include bg-color(#fcfcfc, #1f1f1f);
			border-radius: 8px;
			.name-container {
				@include layout(auto, auto, 0 8px 8px 8px, 0);
				@include flex-box(row, space-between, center, wrap);
				.name-content {
					width: 68px;
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
		.tag-aritlce-item {
			margin-bottom: $main-margin;
		}
	}
}
</style>
