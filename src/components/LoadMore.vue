<template>
	<div class="pagination-container" @click="loadMore">
		<span class="pagination-content">加载更多</span>
	</div>
</template>

<script lang="ts" setup>
const emit = defineEmits<{
	(e: 'on-load-more'): void
}>()
const loadMore = () => emit('on-load-more')
</script>

<style lang="scss" scoped>
.pagination-container {
	$mc: var(--el-color-primary);
	@include layout(auto, auto, 16px 0, 0);
	.pagination-content {
		@include layout(180px, auto, 0, 8px 16px);
		@include border(2px solid $mc, 8px);
		@include flex-box(row, center, center, nowrap);
		@include font-hei;
		@include transition(all 300ms ease-in-out);
		font-size: 18px;
		font-weight: bolder;
		color: #fff;
		border-color: $mc;
		background-color: $mc;
		cursor: pointer;
		&:hover {
			transform: scale(1.05);
			box-shadow: rgba(17, 17, 26, 0.1) 0px 8px 24px,
				rgba(17, 17, 26, 0.1) 0px 16px 56px, rgba(17, 17, 26, 0.1) 0px 24px 80px;
		}
	}
}
</style>
