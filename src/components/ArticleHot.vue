<template>
	<div class="article-hot-container">
		<div class="article-hot-title">热门文章</div>
		<div class="article-hot-list">
			<el-skeleton :loading="loading" animated :count="pageSize">
				<template #template>
					<div class="skeleton-item">
						<el-skeleton-item variant="image" class="article-cover" />
						<div class="article-content">
							<el-skeleton-item variant="p" class="article-title" />
							<el-skeleton-item variant="text" class="article-description" />
							<el-skeleton-item variant="text" class="article-description" />
						</div>
					</div>
				</template>
				<template #default>
					<div
						v-for="article in articles"
						:key="article.id"
						class="article-hot-item"
						@click="toArticle(article.id)"
					>
						<div class="article-cover">
							<img
								v-if="article.banner && article.banner.path"
								v-LazyLoad="
									`${article.banner.path}?x-oss-process=image/resize,m_fill,h_64,w_64`
								"
								alt="noImg"
							/>
							<img v-else src="/static/img/defaultCover.jpg" alt="noImg" />
						</div>
						<div class="article-content">
							<div class="favorite-content">
								<div class="favorite-num">{{ article.favoCount }}</div>
								<i-custom-fire class="favorite-icon" />
							</div>
							<div class="article-title">
								{{ article.title }}
							</div>
							<div class="article-description">
								{{ article.description }}
							</div>
						</div>
					</div>
				</template>
			</el-skeleton>
		</div>
	</div>
</template>

<script lang="ts" setup>
const loading = ref(true)
const router = useRouter()
const articleStore = useArticle()
const articles = computed(() => articleStore.getArticlesHot)
const pageSize = 8
const toArticle = (id: number) => {
	router.push({ name: 'article', params: { id } })
}
const init = async () => {
	await articleStore.GetArticlesHot({ pageSize })
	loading.value = false
}
init()
</script>

<style lang="scss" scoped>
.article-hot-container {
	@include layout(100%, auto, 0, 8px);
	@include scroll-bar-reset(
		6px,
		auto,
		transparent,
		var(--el-border-color),
		3px
	);
	@include border(none, 8px);
	@include bg-color(#fff);
	box-shadow: var(--el-box-shadow);
	z-index: 1000;

	.article-hot-title {
		@include layout(auto, auto, 4px, 4px 8px);
		border-left: 4px solid var(--el-color-danger);
		background-color: var(--el-color-danger-light-9);
		border-radius: 4px;
		font-size: 16px;
		font-weight: bold;
	}

	.article-hot-list {
		@include layout(100%, auto, 8px 0 0 0, 0);
		@include flex-box(column, flex-start, center, nowrap);

		.skeleton-item {
			@include layout(100%, auto, 0, 8px);
			@include flex-box(row, space-between, center, nowrap);
			.article-cover {
				@include layout(64px, 64px, 0, 0);
			}
			.article-content {
				@include layout(calc(100% - 76px), 68px, 0 0 0 8px, 0);
				.article-title {
					width: 65%;
				}
				.article-description {
					width: 100%;
					&:last-child {
						width: 80%;
					}
				}
			}
		}
		.article-hot-item {
			@include layout(100%, auto, 0, 8px);
			@include flex-box(row, space-between, center, nowrap);
			@include border(none, 8px);
			cursor: pointer;
			position: relative;
			&:after {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				border-radius: 8px;
				background-color: transparent;
				transition: all 300ms ease-out;
			}
			.article-cover {
				@include layout(64px, 64px, 0, 0);
				position: relative;

				&::after {
					@include position(absolute);
					content: '';
					top: 0;
					left: 0;
					width: 64px;
					height: 64px;
					background-color: transparent;
					transform: scale(1.05);
					html.dark & {
						background-color: #00000030;
					}
					transition: all 300ms ease-out;
				}
				img {
					@include layout(100%, 100%, 0, 0);
					@include border(none, 4px);
					transform: scale(1.05);
					object-fit: cover;
					object-position: center;
					overflow: hidden;
					transition: all 300ms ease-out;
				}
			}
			.article-content {
				position: relative;
				@include layout(calc(100% - 76px), 64px, 0 0 0 8px, 2px 4px);

				.favorite-content {
					position: absolute;
					top: 0;
					right: 0;
					z-index: 1000;
					color: #fb7756;

					.favorite-num {
						display: inline-block;
						@include font-hei;
						text-align: center;
						font-size: 12px;
						font-weight: bolder;
						margin-right: 2px;
					}

					.favorite-icon {
						display: inline-block;
						font-size: 15px;
					}
				}
				.article-title {
					color: var(--el-color-danger-light-3);
					font-weight: bolder;
					font-size: 14px;
					@include text-overflow(1, 24px);
					transition: all 300ms ease-out;
				}
				.article-description {
					color: var(--el-text-color-secondary);
					margin-top: 4px;
					font-size: 12px;
					font-style: italic;
					@include text-overflow(2);
					transition: all 300ms ease-out;
				}
			}
			&:hover {
				.article-cover {
					&:after {
						transform: scale(1);
					}
					img {
						transform: scale(1);
					}
				}
				.article-content {
					.article-title {
						color: var(--el-color-danger);
					}
					.article-description {
						color: var(--el-text-color-regular);
					}
				}
				&:after {
					background-color: #00000010;

					html.dark & {
						background-color: #ffffff10;
					}
				}
			}
		}
	}
}
</style>
