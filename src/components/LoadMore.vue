<template>
	<div class="pagination-container" @click="loadMore">
		<div class="pagination-content">
			<slot></slot>
		</div>
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
	@include layout(auto, auto, 16px 0, 0);

	.pagination-content {
		position: relative;
		@include layout(100px, 28px, 0, 0);
		@include flex-box(row, center, center, nowrap);
		@include font-hei;
		font-size: 16px;
		font-weight: bolder;
		color: var(--el-color-primary);
		cursor: pointer;
		@include transition(all 300ms ease-in-out);
		&::before,
		&::after {
			content: '';
			position: absolute;
			width: 20px;
			height: 20px;
			@include transition(all 300ms ease-in-out);
		}

		&::before {
			top: -4px;
			left: -4px;
			border-top: 2px solid var(--el-color-primary);
			border-left: 2px solid var(--el-color-primary);
		}

		&::after {
			bottom: -4px;
			right: -4px;
			border-bottom: 2px solid var(--el-color-primary);
			border-right: 2px solid var(--el-color-primary);
		}

		&:hover::before,
		&:hover::after {
			width: calc(100% + 8px);
			height: calc(100% + 8px);
		}
		&:hover {
			background-color: var(--el-color-primary);
			color: #fff;
		}
	}
}
</style>
