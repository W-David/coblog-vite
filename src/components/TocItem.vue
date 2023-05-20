<template>
	<div class="toc-item-container">
		<div :class="['toc-item', isActived ? 'is-actived' : '']">
			<div
				class="item-content"
				:style="{ 'text-indent': itemIndent }">
				<a @click="anchor(item.anchor)">{{ item.content }}</a>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
const props = withDefaults(
	defineProps<{
		item: TocItem
		indent?: number
		isActived?: boolean
	}>(),
	{
		indent: 16,
		isActived: false
	}
)
const emits = defineEmits<{
	(e: 'on-checked', anchor: string): void
}>()
const { item, indent } = toRefs(props)
const itemIndent = computed(() => `${indent.value * Math.max(item.value.level - 1, 0)}px`)
const anchor = (anchor: string) => {
	emits('on-checked', anchor)
	scrollToByView(anchor)
}
</script>

<style lang="scss" scoped>
.toc-item-container {
	.toc-item {
		@include layout(auto, auto, 4px, 4px 12px);
		@include border(none, 4px);
		transition: all 220ms ease;
		cursor: pointer;
		.item-content {
			a {
				font-size: 14px;
				height: 18px;
				line-height: 18px;
				color: var(--el-text-color-regular);
				@include text-overflow(1, 8px);
				transition: all 220ms ease;
				&:hover {
					color: var(--el-color-primary);
					// text-decoration: underline;
					// text-underline-offset: 4px;
				}
			}
		}
		&.is-actived {
			background-color: var(--el-bg-color-page);
			.item-content {
				a {
					color: var(--el-color-primary);
					// text-decoration: underline;
					// text-underline-offset: 6px;
				}
			}
		}
		&:hover {
			background-color: var(--el-bg-color-page);
		}
	}
}
</style>
