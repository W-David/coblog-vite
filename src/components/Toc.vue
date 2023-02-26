<template>
	<div class="toc-container">
		<div class="toc-list-title">文章目录</div>
		<div class="toc-list">
			<el-skeleton :loading="loading" animated :count="3">
				<template #template>
					<div class="skeleton-item">
						<el-skeleton-item class="toc toc-1"></el-skeleton-item>
						<el-skeleton-item class="toc toc-2"></el-skeleton-item>
						<el-skeleton-item class="toc toc-3"></el-skeleton-item>
						<el-skeleton-item class="toc toc-4"></el-skeleton-item>
						<el-skeleton-item class="toc toc-5"></el-skeleton-item>
					</div>
				</template>
				<template #default>
					<div v-if="tocArray?.length">
						<toc-item
							v-for="item in tocArray"
							:key="item.anchor"
							:item="item"
							:is-actived="activedArr.includes(item.anchor)"
							@on-checked="onChecked"
						></toc-item>
					</div>
					<div v-else>
						<div class="no-toc"></div>
					</div>
				</template>
			</el-skeleton>
		</div>
	</div>
</template>

<script lang="ts" setup>
const activedArr = ref<string[]>([])
const articleStore = useArticle()
const tocArray = computed(() => articleStore.cataLog ?? [])
const loading = computed(() => articleStore.isTocLoading)
const isActived = (anchor: string) => {
	const element = document.getElementById(anchor)
	if (!element) return false
	const top = element.getBoundingClientRect().top
	return top > 0 && top < 120
}
const onChecked = (anchor: string) => activedArr.value.push(anchor)
const onScroll = () => {
	activedArr.value.splice(0, activedArr.value.length)
	tocArray.value.forEach((toc) => {
		if (isActived(toc.anchor)) {
			activedArr.value.push(toc.anchor)
		}
	})
}
useScrollPage({ onScroll, delay: 100 })
onMounted(() => onScroll())
</script>

<style lang="scss" scoped>
.toc-container {
	@include layout(100%, auto, 0, 8px);
	@include scroll-bar-reset(
		6px,
		auto,
		transparent,
		var(--el-border-color),
		3px
	);
	@include border(none, 8px);
	background-color: var(--el-bg-color);
	box-shadow: var(--el-box-shadow);
	z-index: 1000;

	.toc-list-title {
		@include layout(auto, auto, 4px 8px, 2px 8px);
		border-left: 4px solid var(--el-color-primary);
		font-size: 16px;
		font-weight: bold;
	}
	.toc-list {
		@include layout(auto, auto, 12px 8px 8px 8px, 0);
		// @include border(1px solid var(--el-border-color), 8px);
		// @include box-shadow;
		.skeleton-item {
			.toc {
				height: 20px;
				margin-bottom: 8px;
				display: block;
			}
			.toc-1 {
				width: 20%;
				margin-left: 16px;
			}
			.toc-2 {
				width: 30%;
				margin-left: 16px;
			}
			.toc-3 {
				width: 50%;
				margin-left: 32px;
			}
			.toc-4 {
				width: 70%;
				margin-left: 32px;
			}
			.toc-5 {
				width: 50%;
				margin-left: 48px;
			}
		}
		.no-toc {
		}
	}
}
</style>
