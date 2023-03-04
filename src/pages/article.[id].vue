<template>
	<div class="article-page">
		<div class="article-area">
			<div class="article-ctrl-area" @click="toBack">
				<el-icon :size="20"><i-ep-caret-left /></el-icon>
			</div>
			<el-skeleton :loading="loading" animated>
				<template #template>
					<div class="skeleton-item">
						<el-skeleton-item variant="image" class="banner"></el-skeleton-item>
						<div class="title-container">
							<div class="row-container">
								<el-skeleton-item variant="p" class="title"></el-skeleton-item>
								<el-skeleton-item
									variant="rect"
									class="favorite"
								></el-skeleton-item>
							</div>
							<div class="ct-container">
								<el-skeleton-item class="ct-1"></el-skeleton-item>
								<el-skeleton-item class="ct-2"></el-skeleton-item>
							</div>
							<div class="desc-container">
								<el-skeleton-item variant="p" class="desc"></el-skeleton-item>
							</div>
						</div>
						<div class="content-container">
							<el-skeleton-item
								variant="rect"
								class="content"
							></el-skeleton-item>
						</div>
						<div class="editor-container">
							<el-skeleton-item
								variant="button"
								class="btn-1"
							></el-skeleton-item>
							<el-skeleton-item
								variant="button"
								class="btn-2"
							></el-skeleton-item>
						</div>
					</div>
				</template>
				<template #default>
					<div v-if="article" class="article-main-area">
						<div
							v-if="article.banner && article.banner.path"
							class="article-banner-container"
						>
							<img
								v-LazyLoad="
									`${article.banner.path}?x-oss-process=image/resize,p_50`
								"
								alt="noImg"
							/>
							<div class="article-info-content">
								<span class="article-author">{{
									article.admin?.nickname || '佚名'
								}}</span>
								<span class="article-sp">|</span>
								<span class="article-date">{{ article.createdAt }}</span>
							</div>
						</div>
						<div class="article-title-container">
							<div class="row-container">
								<div class="article-title-content">{{ article.title }}</div>
								<div class="article-favorite-content">
									<div class="favorite-icon" @click="handleFavorite">
										<i-custom-favorite-full v-if="article.isFavorited" />
										<i-custom-favorite v-else />
									</div>
									<div class="favorite-num">{{ article.favoritedNum }}</div>
								</div>
							</div>
							<div class="article-panel-content">
								<category-panel
									v-for="category in article.categories"
									:key="category.id"
									:size="10"
									:category="category"
								></category-panel>
								<tag-panel
									v-for="tag in article.tags"
									:key="tag.id"
									:size="10"
									:tag="tag"
								></tag-panel>
							</div>
							<div class="article-desc-content">{{ article.description }}</div>
						</div>
						<div class="article-content-container">
							<div id="article-content" class="article-content">
								<md-editor
									v-model="article.content"
									:theme="isDark ? 'dark' : 'light'"
									:preview-only="true"
									preview-theme="cyanosis"
									@get-catalog="getCatalog"
								/>
							</div>
						</div>
						<div v-if="isLogin && isCurAdmin" class="article-edit-container">
							<el-button type="danger" round @click="handleDel"
								>删除 • 需输入文章标题</el-button
							>
							<el-button type="success" round @click="handleEdit"
								>修改文章</el-button
							>
						</div>
					</div>
				</template>
			</el-skeleton>
		</div>
		<el-backtop :bottom="25"> </el-backtop>
	</div>
</template>

<script lang="ts" setup>
import type { HeadList } from 'md-editor-v3'
import MdEditor from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

definePage({
	name: 'article',
	meta: {
		layout: 'article',
		transitionName: 'slide-fade-right',
	},
})

const { isDark } = useDarks()
const adminStore = useAdmin()
const articleStore = useArticle()
const route = useRoute<'article'>()
const articleId = +route.params.id
const router = useRouter()
const loginInfo = computed(() => adminStore.adminInfo)
const isLogin = computed(() => adminStore.isLogin)
const article = computed(() => articleStore.getArticleById(articleId))
const loading = ref(true)
watch(loading, (val) => (articleStore.isArticleLoading = val), {
	immediate: true,
})
const isCurAdmin = computed(
	() => article.value?.admin.id === loginInfo.value?.id
)

const getArticle = async () => {
	loading.value = true
	await articleStore.GetArticle(articleId)
	loading.value = false
}
const getCatalog = (catalog: HeadList[]) => {
	articleStore.cataLog = catalog
		.map(({ text, level }) => ({ content: text, anchor: text, level }))
		.slice(0)
}

const handleDel = async () => {
	usePrompt({
		title: '【请输入文章标题确认删除】',
		content: '删除确认',
		confirmText: '删除此文章',
		cancelText: '取消',
		callback: async (value) => {
			if (value && value === article.value?.title) {
				return {
					success: false,
					msg: '文章标题输入有误',
				}
			}
			const res = await articleStore.DelArticle(articleId)
			router.push({ path: '/' })
			return {
				success: !!res,
				msg: res ? `已删除${article.value?.title}` : '删除失败',
			}
		},
	})
}
const handleEdit = () => {
	router.push({ name: 'blog', params: { id: articleId } })
}
const toBack = () => {
	router.back()
}
const handleFavorite = async () => {
	const res = await articleStore.FavoriteArticle({ id: articleId })
	if (res.data.code === 200 && article.value) {
		article.value.isFavorited = !article.value.isFavorited
		article.value.favoritedNum = res.data.data ?? 0
	}
}

const initPage = () => {
	articleStore.cataLog.splice(0, articleStore.cataLog.length)
	getArticle()
}

initPage()
</script>

<style lang="scss" scoped>
.article-page {
	@include layout(100%, auto, 0 0 $main-margin 0, 0);
	z-index: 1000;
	.article-area {
		.article-ctrl-area {
			position: fixed;
			bottom: 24px;
			left: 24px;
			width: 40px;
			height: 40px;
			border-radius: 50%;
			display: flex;
			justify-content: center;
			align-items: center;
			color: var(--el-color-primary);
			@include bg-color(#fff, #1d1d1d);
			z-index: 1000;
			box-shadow: 0 0 6px rgb(0 0 0 / 12%);
			cursor: pointer;
			&:hover {
				background-color: var(--el-color-primary-light-9);
			}
		}

		.skeleton-item {
			@include layout(100%, auto, 0, 0);
			.banner {
				@include layout(100%, 320px, 0 0 12px 0, 0);
				@include border(none, 8px);
				@include box-shadow;
			}
			.title-container {
				@include layout(100%, auto, 0 0 12px 0, 8px);
				@include border(none, 8px);
				@include box-shadow;
				.row-container {
					@include layout(100%, auto, 4px 0, 4px 8px);
					@include flex-box(row, space-between, flex-start, wrap);
					.title {
						height: 28px;
						width: 60%;
					}
					.favorite {
						width: 48px;
						height: 48px;
					}
				}
				.ct-container {
					@include layout(100%, auto, 4px 0, 4px);
					text-align: start;
					.ct-1 {
						@include layout(64px, 16px, 6px, 0);
						border-radius: 8px;
					}
					.ct-2 {
						@include layout(80px, 16px, 6px, 0);
						border-radius: 8px;
					}
				}

				.desc-container {
					@include layout(100%, auto, 0, 8px);
					text-align: start;
					.desc {
						width: 80%;
						height: 16px;
					}
				}
			}
			.content-container {
				@include layout(100%, auto, 0 0 12px 0, 16px);
				@include border(none, 8px);
				@include box-shadow;
				.content {
					width: 100%;
					height: 880px;
				}
			}
			.editor-container {
				@include layout(100%, auto, 0, 8px 0);
				@include flex-box(row, flex-end, center);
				@include border(none, 8px);
				.btn-1 {
					width: 170px;
					height: 32px;
					border-radius: 16px;
				}
				.btn-2 {
					width: 88px;
					height: 32px;
					border-radius: 16px;
					margin-left: 12px;
				}
			}
		}
		.article-main-area {
			@include layout(100%, 100%, 0, 0);
			// @include border(1px solid #eee, 8px);
			// @include box-shadow(2px 4px 16px rgba(0, 0, 0, 0.1));
			// @include bg-color(#fafafa, #2f2f2f);
			.article-banner-container {
				@include layout(100%, 320px, 0 0 12px 0, 0);
				@include border(none, 6px);
				@include box-shadow;
				position: relative;

				&::after {
					@include position(absolute);
					content: '';
					top: 0;
					left: 0;
					width: 100%;
					height: 320px;
					background-color: transparent;
					html.dark & {
						background-color: #00000050;
					}
				}
				img {
					object-fit: cover;
					width: 100%;
					height: 100%;
					border-radius: 6px;
				}
				.article-info-content {
					@include layout(auto, auto, 8px 0 0 0, 4px 8px);
					@include border(1px solid rgba(0, 0, 0, 0.8), 4px);
					@include box-shadow(2px 2px 8px rgba(0, 0, 0, 0.1));
					background-color: rgba(0, 0, 0, 0.6);
					position: absolute;
					right: 8px;
					bottom: 8px;
					.article-author {
						color: var(--el-color-success);
						font-weight: bold;
						font-size: 14px;
						// text-align: end;
					}
					.article-sp {
						margin: 0 8px;
						font-weight: lighter;
						color: #000;
					}
					.article-date {
						color: var(--el-color-warning);
						font-size: 12px;
					}
				}
			}
			.article-title-container {
				@include layout(100%, auto, 0 0 12px 0, 8px);
				@include border(none, 8px);
				@include box-shadow;
				background-color: var(--el-bg-color);
				.row-container {
					@include layout(100%, auto, 4px 0, 4px 8px);
					@include flex-box(row, space-between, flex-start, wrap);
				}
				.article-panel-content {
					@include layout(100%, auto, 4px 0, 4px);
					text-align: start;
				}
				.article-title-content {
					@include font-hei;
					max-width: 90%;
					font-size: 28px;
					font-weight: bolder;
					line-height: 1.2 !important;
				}
				.article-favorite-content {
					.favorite-icon {
						color: #e74645;
						text-align: center;
						cursor: pointer;
						font-size: 22px;
						transition: all 500ms ease;
						&:hover {
							transform: scale(1.25);
						}
					}
					.favorite-num {
						@include font-hei;
						text-align: center;
						font-size: 13px;
						color: var(--el-text-color-secondary);
					}
				}
				.article-desc-content {
					@include layout(100%, auto, 0, 8px);
					@include font-fang-song;
					color: var(--el-text-color-primary);
					font-style: italic;
					font-weight: bold;
					// @include border(none, 4px);
					// background-color: #fcfcfc;
					text-align: start;
				}
			}
			.article-content-container {
				@include layout(100%, auto, 0 0 12px 0, 0);
				@include border(none, 8px);
				@include box-shadow;
				.article-content {
					.md-editor {
						padding: 8px 32px;
						@include border(none, 8px);
						background-color: var(--el-bg-color);
					}
					@media (max-width: 767px) {
						.md-editor {
							padding: 8px 24px;
						}
					}
				}
			}

			.article-edit-container {
				@include layout(100%, auto, 0, 8px 0);
				@include flex-box(row, flex-end, center);
				@include border(none, 8px);
				// @include box-shadow(4px 4px 16px rgba(0, 0, 0, 0.1));
			}
		}

		.article-comments-area {
			@include layout(100%, auto, $main-margin 0 0 0, 8px 12px);
			@include border(1px solid #eee, 8px);
			@include box-shadow(4px 4px 16px rgba(0, 0, 0, 0.1));
			@include bg-color(#fafafa, #1f1f1f);
		}
	}
}
</style>
