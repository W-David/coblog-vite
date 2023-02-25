<template>
	<div class="article-card-container">
		<div class="article-banner-container">
			<div class="article-banner-img">
				<img
					v-if="article.banner && article.banner.path"
					v-LazyLoad="
						`${article.banner.path}?x-oss-process=image/resize,m_fill,h_280,w_780`
					"
					alt="noImg"
				/>
				<img v-else src="/static/img/defaultCover.jpg" alt="noImg" />
			</div>
			<div
				:class="[
					'article-banner-description',
					!isBannerHover ? 'spinner-border' : '',
				]"
				@mouseenter="isBannerHover = true"
				@mouseleave="isBannerHover = false"
				@click="openDetail"
			>
				阅读全文
			</div>
			<!-- <div class="article-no-banner" v-if="!article.banner">
        <div class="article-no-banner-hint">暂无头图</div>
        <div class="article-no-banner-link" @click="openDetail">阅读原文</div>
      </div> -->
		</div>
		<div class="article-title-container">
			<span class="title-content" @click="openDetail">
				{{ article.title }}
			</span>
		</div>
		<div
			v-if="article.categories?.length || article.tags?.length"
			class="article-ct-container"
		>
			<category-panel
				v-for="category in article.categories"
				:key="category.id"
				:size="12"
				:category="category"
			></category-panel>
			<tag-panel
				v-for="tag in article.tags"
				:key="tag.id"
				:size="12"
				:tag="tag"
			></tag-panel>
		</div>
		<div v-if="article.description" class="article-content-container">
			{{ article.description }}
		</div>
		<div class="article-description-container">
			<div class="article-time">
				<el-icon><i-ep-calendar /></el-icon>
				{{ article.createdAt.split(' ')[0] }}
			</div>
			<div class="load-more">
				<el-button text bg @click="openDetail">
					<span>详情</span>
					<el-icon><i-ep-arrow-right /></el-icon>
				</el-button>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
const router = useRouter()
const props = defineProps<{
	article: Article
}>()
const { article } = toRefs(props)
const openDetail = () => {
	const { id } = article.value
	router.push({ name: 'article', params: { id } })
}
const isBannerHover = ref(false)
</script>

<style lang="scss" scoped>
$descrip-mr: 12px;

.article-card-container {
	@include layout(100%, 100%, 0, 0);
	@include border(1px solid var(--el-border-color-light), 6px);
	@include transition(all 120ms ease-in-out);
	// @include box-shadow;
	box-shadow: var(--el-box-shadow);
	@include bg-color();
	z-index: 1000;

	.article-banner-container {
		@include layout(100%, 280px, 0, 0);
		@include position(relative);
		border-bottom-color: var(--el-border-color-light);
		.article-banner-description {
			@include position(absolute);
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			@include layout(auto, auto, 0, 6px 12px);
			@include border(2px solid var(--el-color-primary), 4px);
			opacity: 0;
			color: var(--el-color-primary);
			transition: all 220ms ease-out;
			@include pointer;
			&:hover {
				@include layout(auto, auto, 0, 12px 18px);
			}
		}

		.spinner-border {
			@include spinner-border-animation;
		}

		.article-banner-img {
			@include layout(100%, 100%, 0, 0);
			@include position(relative);
			border-radius: 6px 6px 0 0;
			overflow: hidden;
			&::after {
				@include position(absolute);
				content: '';
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background-color: transparent;
				html.dark & {
					background-color: #00000030;
				}
				transition: transform 600ms ease-out;
			}
			img {
				width: 100%;
				height: 100%;
				transform: scale(1.2);
				object-fit: cover;
				transition: transform 600ms ease-out;
			}
		}
		.article-no-banner {
			@include layout(100%, 100%, 0, 0);
			@include flex-box(rows, center, center);
			background-color: rgba(0, 0, 0, 0.085);
			transition: background-color 600ms ease-out;
			position: relative;
			font-size: 24px;
			.article-no-banner-hint {
				transition: all 600ms ease-out;
				color: var(--el-color-primary-light-3);
			}
			.article-no-banner-link {
				padding: 6px 12px;
				border-radius: 4px;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				opacity: 0;
				transition: all 600ms ease-out;
			}
		}
		&:hover {
			.article-banner-description {
				opacity: 1;
				color: var(--el-color-primary);
				border-color: var(--el-color-primary);
			}
			.article-banner-img {
				img {
					transform: scale(1.08);
				}
				&:after {
					background-color: #00000050;
					html.dark & {
						background-color: #00000080;
					}
				}
			}
			.article-no-banner {
				background-color: rgba(0, 0, 0, 0.2);
				.article-no-banner-hint {
					opacity: 0;
				}
				.article-no-banner-link {
					background-color: var(--el-color-success);
					padding: 12px 24px;
					color: white;
					opacity: 1;
				}
			}
		}
	}

	.article-title-container {
		@include layout(100%, auto, 16px 0 0 0, 8px);
		@include flex-box(row, center, center);

		.title-content {
			@include font-kai;
			color: var(--el-color-primary);
			font-size: 24px;
			font-weight: bold;
			@include pointer;
			transition: all 220ms ease-out;
			max-width: 88%;
			&:hover {
				transform: scale(1.02);
			}
		}
	}

	.article-ct-container {
		@include layout(auto, auto, 0 32px, 8px 0);
		@include flex-box(row, center, center, wrap);
		@include border(2px solid var(--el-border-color-extra-light), null, bottom);
	}

	.article-content-container {
		@include layout(auto, auto, 0, 8px 32px);
		@include text-overflow(5);
		color: var(--el-text-color-regular);
		font-size: 15px;
		line-height: 1.6;
		text-align: left;
		text-indent: 16px;
	}

	.article-description-container {
		@include layout(100%, auto, 0, 0 16px 12px 16px);
		@include flex-box(row, space-between);

		.article-time {
			@include flex-box(row, center, center);
			color: var(--el-text-color-secondary);
			font-size: 12px;
			&:deep .el-icon {
				margin-right: 6px;
			}
		}

		.load-more {
			@include transition(all 120ms ease);
			@include pointer;
			transition: all 220ms ease-out;
			&:deep .el-button {
				font-weight: bold;
				&:hover {
					color: var(--el-color-primary);
				}
			}
		}
	}

	&:hover {
		border-color: var(--el-border-color);
		@include box-shadow(4px 4px 12px 0 rgba(0, 0, 0, 0.1));
	}
}
</style>
