<template>
	<div v-if="tocArray?.length" class="toc-container">
		<div class="toc-list-title">文章目录</div>
		<div class="toc-list">
			<toc-item
				v-for="item in tocArray"
				:key="item.anchor"
				:item="item"
				:is-actived="activedArr.includes(item.anchor)"
				@on-checked="onChecked"
			></toc-item>
		</div>
	</div>
</template>

<script lang="ts" setup>
const activedArr = ref<string[]>([])
const articleStore = useArticle()
const tocArray = computed(() => articleStore.cataLog ?? [])
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
	}
}
</style>
