<template>
	<div class="archive-page">
		<div class="archive-timeline-container">
			<div class="timeline-container">
				<div class="archive-timeline-ctrl">
					<el-radio-group
						v-model="form.format"
						@change="reGetArchive()">
						<el-radio
							label="month"
							border>
							月份
						</el-radio>
						<el-radio
							label="week"
							border>
							每周
						</el-radio>
						<el-radio
							label="day"
							border>
							日期
						</el-radio>
					</el-radio-group>
				</div>
				<el-skeleton
					:loading="isLoadingMore"
					animated
					:count="form.pageSize">
					<template #template>
						<div class="skeleton-item">
							<div class="timestamp-container">
								<el-skeleton-item class="timestamp"></el-skeleton-item>
							</div>
							<div class="content-container">
								<div class="title-container">
									<el-skeleton-item class="title-1"></el-skeleton-item>
									<el-skeleton-item class="title-2"></el-skeleton-item>
								</div>
								<div class="article-container">
									<div class="article-title">
										<el-skeleton-item class="title"></el-skeleton-item>
										<el-skeleton-item class="time"></el-skeleton-item>
									</div>
									<div class="article-info">
										<el-skeleton-item class="ct-1"></el-skeleton-item>
										<el-skeleton-item class="ct-2"></el-skeleton-item>
									</div>
									<div class="article-time hidden-md-and-up">
										<el-skeleton-item class="time"></el-skeleton-item>
									</div>
								</div>
							</div>
						</div>
					</template>
					<template #default>
						<el-timeline>
							<el-timeline-item
								v-for="a in archive"
								:key="a.time"
								:timestamp="a.time"
								type="primary"
								:hollow="true"
								placement="top">
								<el-collapse :model-value="[a.time]">
									<el-collapse-item :name="a.time">
										<template #title>
											<div class="display-title-container">
												<div
													v-for="(title, index) in generateArchiveTitles(a.articles)"
													:key="index"
													class="display-title">
													<div class="display-title-content">{{ title }}</div>
												</div>
											</div>
										</template>
										<div
											v-for="article in a.articles"
											:key="article.id"
											class="article-card"
											@click="toArticle(article.id)">
											<div class="article-title">
												<span class="title-content">{{ article.title }}</span>
												<span class="time-content hidden-sm-and-down">{{ article.createdAt }}</span>
											</div>
											<div
												v-if="(article.categories && article.categories.length) || (article.tags && article.tags.length)"
												class="article-info">
												<category-panel
													v-for="category in article.categories"
													:key="category.id"
													:size="12"
													:category="category"></category-panel>
												<tag-panel
													v-for="tag in article.tags"
													:key="tag.id"
													:size="12"
													:tag="tag"></tag-panel>
											</div>
											<div class="m-article-time hidden-md-and-up">
												<span class="time-content">
													{{ article.createdAt }}
												</span>
											</div>
										</div>
									</el-collapse-item>
								</el-collapse>
							</el-timeline-item>
						</el-timeline>
					</template>
				</el-skeleton>
			</div>
		</div>
		<page-load
			v-show="archive && archive.length"
			:is-loading-more="isLoadingMore"
			:has-more="hasMore"
			@on-load-more="onLoadMore"></page-load>
	</div>
</template>

<script lang="ts" setup>
const router = useRouter()
const articleStore = useArticle()
definePage({
	name: 'archive',
	meta: {
		transitionName: 'fade'
	}
})
const form = reactive({
	pageNum: 1,
	pageSize: 5,
	format: 'month'
})

const archive = computed(() => articleStore.getArticleArchive)
const hasMore = ref(true)
const isLoadingMore = ref(true)
const getArchive = async (data: any) => {
	if (!hasMore.value) return
	isLoadingMore.value = true
	const [list, total] = await articleStore.GetArticleArchive(data)
	isLoadingMore.value = false
	hasMore.value = list && list.length > 0 && form.pageNum * form.pageSize < total
	return list
}
const generateArchiveTitles = (articles: ArticleTime[]) => {
	if (articles && articles.length) {
		const len = Math.min(articles.length, 3)
		return articles.slice(0, len).map(article => article.title)
	} else {
		return ['暂无文章']
	}
}
const toArticle = (id: number) => {
	router.push({ name: 'article', params: { id } })
}
const onLoadMore = async () => {
	const list = await getArchive(Object.assign(form, { pageNum: form.pageNum + 1 }))
	if (list?.length) {
		form.pageNum += 1
	}
}

const reGetArchive = () => {
	articleStore.articleArchive.splice(0, articleStore.articleArchive.length)
	form.pageNum = 1
	hasMore.value = true
	isLoadingMore.value = true
	getArchive(form)
}

const initPage = () => {
	getArchive(form)
}

initPage()
</script>

<style lang="scss" scoped>
@mixin custom-border-radio($n, $c) {
	.el-radio:nth-child(#{$n}) {
		margin-right: 16px;
		&.is-bordered {
			&.is-checked {
				border-color: $c;
				.el-radio__label {
					color: $c;
				}
				.el-radio__inner {
					border-color: $c;
					background-color: $c;
				}
			}
		}
	}
}
.archive-page {
	@include layout(100%, auto, 0 0 $main-margin 0, 0);
	z-index: 1000;
	.archive-timeline-container {
		.timeline-container {
			@include layout(100%, 100%, 0, 32px);
			@include border(none, 8px);
			@include box-shadow(4px 4px 16px rgba(0, 0, 0, 0.1));
			@include bg-color(#fff, #1d1d1d);
			.archive-timeline-ctrl {
				margin-bottom: 16px;
				&:deep {
					@include custom-border-radio(1, var(--el-color-success));
					@include custom-border-radio(2, var(--el-color-primary));
					@include custom-border-radio(3, var(--el-color-danger));
				}
			}
			.skeleton-item {
				.timestamp-container {
					.timestamp {
						width: 20%;
						height: 20px;
					}
				}
				.content-container {
					.title-container {
						@include layout(100%, auto, 0, 8px);
						@include flex-box(row, flex-start, center, nowrap);
						.title-1 {
							width: 25%;
							margin-right: 12px;
						}
						.title-2 {
							width: 10%;
						}
					}
					.article-container {
						@include layout(95%, 100%, 16px auto, 12px 16px);
						@include box-shadow(1px 1px 4px rgba(0, 0, 0, 0.05), -1px -1px 4px rgba(0, 0, 0, 0.02));
						border-radius: 4px;
						.article-title {
							@include layout(100%, auto, 0, 0);
							@include flex-box(row, space-between, center, wrap);
							.title {
								width: 42%;
								height: 38px;
							}
							.time {
								width: 120px;
							}
						}
						.article-info {
							@include layout(100%, auto, 0, 12px 0);
							@include flex-box(row, flex-start, center, wrap);
							.ct-1 {
								@include layout(64px, 16px, 6px, 0);
								border-radius: 8px;
							}
							.ct-2 {
								@include layout(80px, 16px, 6px, 0);
								border-radius: 8px;
							}
						}
						.article-time {
							@include clearfix;
							.time {
								@include float-left;
								width: 68px;
							}
						}
					}
				}
			}
			ul {
				padding-inline-start: 0;
			}
			&:deep {
				.el-timeline-item__timestamp {
					@include font-kai;
					font-weight: bolder;
					font-size: 20px;
					text-align: left;
					color: var(--el-text-color-primary);

					html.dark & {
						color: #fcfcfc;
					}
				}
				.el-timeline-item__content {
					.display-title-container {
						@include layout(100%, auto, 0, 8px);
						@include flex-box(row, flex-start, center, nowrap);
						overflow: hidden;
						.display-title {
							display: inline-block;
							margin-right: 16px;
							padding: 0 8px;
							max-width: calc(100vw - 152px);
							.display-title-content {
								@include text-overflow(1);
								@include font-fang-song;
								font-style: italic;
								font-weight: bolder;
								color: var(--el-color-primary-light-3);
								&:hover {
									color: var(--el-color-primary);
								}
							}
						}
					}
					.article-card {
						@include layout(95%, 100%, 16px auto, 12px 16px);
						@include border(none, 4px);
						@include box-shadow(1px 1px 4px rgba(0, 0, 0, 0.05), -1px -1px 4px rgba(0, 0, 0, 0.02));
						@include transition(all 220ms ease-in-out);
						@include border(none, 8px);
						@include bg-color(#fff, #1d1d1d);
						@include pointer;

						.article-title {
							@include layout(100%, auto, 0, 0);
							@include flex-box(row, space-between, center, wrap);

							.title-content {
								@include font-kai;
								color: var(--el-color-primary);
								font-size: 22px;
								font-weight: bold;
								@include pointer;
								text-align: left;
							}

							.time-content {
								@include font-hei;
								color: var(--el-text-color-placeholder);
							}
						}
						.article-info {
							@include layout(100%, auto, 0, 12px 0);
							@include flex-box(row, flex-start, center, wrap);
						}
						.m-article-time {
							@include clearfix;
							.time-content {
								@include font-hei;
								@include float-left;
								color: var(--el-text-color-placeholder);
							}
						}

						&:hover {
							@include box-shadow(2px 2px 12px rgba(0, 0, 0, 0.1));
							// border-color: var(--el-border-color-hover);
							transform: scale(1.02);
						}
					}
				}
			}
		}
	}
	.archive-load-more-container {
		@include layout(100%, auto, $main-margin 0 0 0, 0);
		@include flex-box(row, center, center);
	}
}
</style>
