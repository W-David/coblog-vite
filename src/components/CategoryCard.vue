<template>
	<div
		:id="`cate-${category.id}`"
		:class="['category-card-container', isActive ? 'is-active' : '']"
	>
		<div class="category-name">
			<span class="name-content">
				<i-custom-category class="category-icon" />
				{{ category.name }}
			</span>
			<span class="info-content hidden-sm-and-down">
				{{ category.createdBy ? 'create by ' + category.createdBy : '暂无' }}
			</span>
		</div>
		<div class="category-article-list">
			<template v-if="category.articles && category.articles.length">
				<div
					v-for="article in category.articles"
					:key="article.id"
					class="category-article-card"
				>
					<div class="category-article-title" @click="toArticle(article.id)">
						<span class="title-content">
							{{ article.title }}
						</span>
						<span class="time-content">
							{{ article.createdAt }}
						</span>
					</div>
				</div>
			</template>
			<template v-else>
				<div class="category-article-empty">
					<i-custom-empty class="empty-icon" />
				</div>
			</template>
		</div>
	</div>
</template>

<script lang="ts" setup>
const router = useRouter()
const props = withDefaults(
	defineProps<{
		category: CategoryArticle
		isActive?: boolean
	}>(),
	{
		isActive: false,
	}
)
const { category, isActive } = toRefs(props)
const toArticle = (id: number) => {
	router.push({ name: 'article', params: { id } })
}
</script>

<style lang="scss" scoped>
.category-card-container {
	@include position(relative);
	@include layout(100%, auto, 0, 16px);
	@include border(2px solid #eee, 8px);
	@include pointer;
	@include transition(all 120ms ease-in-out);
	@include box-shadow(0 0 16px 0 rgba(0, 0, 0, 0.1));
	@include bg-color(#fcfcfc, #1f1f1f);
	z-index: 1000;

	.category-icon {
		color: var(--el-color-success);
		font-size: 24px;
		text-align: center;
	}
	.empty-icon {
		color: var(--el-color-success-light-3);
		font-size: 42px;
		text-align: center;
	}
	.category-name {
		@include layout(auto, auto, 0 8px 8px 8px, 0);
		@include flex-box(row, space-between, center, wrap);
		white-space: wrap;
		text-align: left;

		.name-content {
			@include font-hei;
			color: var(--el-color-success);
			font-size: 20px;
			font-weight: bolder;
		}
		.info-content {
			@include font-hei;
			color: var(--el-text-color-placeholder);
			font-weight: bold;
		}
	}
	.category-article-list {
		@include layout(100%, auto, 0, 0);
		@include scroll-bar-reset(
			4px,
			auto,
			transparent,
			var(--el-color-success-light-3),
			2px
		);
		min-height: 68px;

		.category-article-card {
			@include layout(auto, auto, 0 8px, 8px);
			@include border(1px solid #ddd, 0, bottom);
			@include pointer;
			@include transition(all 120ms linear);
			.category-article-title {
				@include flex-box(row, space-between, center);
				.title-content {
					color: var(--el-text-color-secondary);

					@include font-kai;
					@include text-overflow(1, 60%);
					font-size: 15px;
					text-align: left;
					font-weight: bolder;
				}
				.time-content {
					color: var(--el-text-color-placeholder);
					font-size: 12px;
					font-style: italic;
					font-weight: bold;
				}
			}
			&:hover,
			html.dark &:hover {
				// transform: scaleX(1.02);
				.title-content {
					color: var(--el-color-success);
				}
				.time-content {
					color: var(--el-color-success-light-3);
				}
			}
		}

		.category-article-empty {
			@include layout(100%, 100%, 0, 0);
			@include flex-box(row, center, center);
		}
	}
	&:hover {
		@include box-shadow(10px 10px 24px 0 rgba(0, 0, 0, 0.1));
		// background-color: var(--el-color-success-light-7);
	}
	&.is-active {
		border-color: var(--el-color-success);
		@include box-shadow;

		html.dark & {
			border-color: var(--el-color-success);
		}
	}
}
</style>
