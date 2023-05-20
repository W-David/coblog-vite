<template>
	<div
		:id="`tag-${tag.id}`"
		:class="['tag-card-container', isActive ? 'is-active' : '']">
		<div class="tag-name">
			<span class="name-content">
				<i-custom-tag class="tag-icon" />
				{{ tag.name }}
			</span>
			<span class="info-content hidden-sm-and-down">
				{{ tag.createdBy ? 'create by ' + tag.createdBy : '暂无' }}
			</span>
		</div>
		<div class="tag-article-list">
			<template v-if="tag.articles && tag.articles.length">
				<div
					v-for="article in tag.articles"
					:key="article.id"
					class="tag-article-card">
					<div
						class="tag-article-title"
						@click="toArticle(article.id)">
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
				<div class="tag-article-empty">
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
		tag: TagArticle
		isActive?: boolean
	}>(),
	{
		isActive: false
	}
)
const { tag, isActive } = toRefs(props)
const toArticle = (id: number) => {
	router.push({ name: 'article', params: { id } })
}
</script>

<style lang="scss" scoped>
.tag-card-container {
	@include position(relative);
	@include layout(100%, auto, 0, 16px);
	@include border(2px solid #eee, 8px);
	@include pointer;
	@include transition(all 120ms ease-in-out);
	@include box-shadow(0 0 16px 0 rgba(0, 0, 0, 0.1));
	@include bg-color(#fcfcfc, #1f1f1f);
	z-index: 1000;

	.tag-icon {
		color: var(--el-color-primary);
		font-size: 24px;
		text-align: center;
	}
	.empty-icon {
		color: var(--el-color-primary-light-5);
		font-size: 42px;
		text-align: center;
	}

	.tag-name {
		@include layout(auto, auto, 0 8px 8px 8px, 0);
		@include flex-box(row, space-between, center, wrap);
		white-space: wrap;
		text-align: left;

		.name-content {
			@include font-hei;
			color: var(--el-color-primary);
			font-size: 20px;
			font-weight: bolder;
		}
		.info-content {
			@include font-hei;
			color: var(--el-text-color-placeholder);
			font-weight: bold;
		}
	}
	.tag-article-list {
		@include layout(100%, auto, 0, 0);
		@include scroll-bar-reset(4px, auto, transparent, var(--el-color-primary-light-5), 2px);
		min-height: 68px;

		.tag-article-card {
			@include layout(auto, auto, 0 8px, 8px);
			@include border(1px solid #ddd, 0, bottom);
			@include pointer;
			@include transition(all 120ms linear);
			.tag-article-title {
				@include flex-box(row, space-between, center);
				@include transition(all 120ms linear);
				.title-content {
					color: var(--el-text-color-secondary);
					@include font-kai;
					@include text-overflow(1, 60%);
					font-size: 16px;
					text-align: left;
					font-weight: bolder;
				}
				.time-content {
					color: var(--el-text-color-placeholder);
					font-size: 12px;
					font-style: italic;
					font-weight: bold;
				}
				&:hover,
				html.dark &:hover {
					// transform: scaleX(1.02);
					.title-content {
						color: var(--el-color-primary);
					}
					.time-content {
						color: var(--el-color-primary-light-3);
					}
				}
			}
		}

		.tag-article-empty {
			@include layout(100%, 100%, 0, 0);
			@include flex-box(row, center, center);
		}
	}
	&:hover {
		@include box-shadow(10px 10px 24px 0 rgba(0, 0, 0, 0.1));
	}
	&.is-active {
		border-color: var(--el-color-primary);
		@include box-shadow;

		html.dark & {
			border-color: var(--el-color-primary);
		}
	}
}
</style>
