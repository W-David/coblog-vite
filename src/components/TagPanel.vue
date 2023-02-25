<template>
	<div
		class="article-tag"
		:style="{
			fontSize: `${size}px`,
			height: `${size * 2}px`,
			lineHeight: `${size * 2}px`,
			borderRadius: `${size}px`,
		}"
		@click.stop="toTag(tag.id)"
	>
		<el-icon :size="size"><i-ep-collection-tag /></el-icon>
		{{ tag.name }}
	</div>
</template>

<script lang="ts" setup>
const router = useRouter()
const props = withDefaults(
	defineProps<{
		tag: Tag
		size?: number
	}>(),
	{
		size: 16,
	}
)
const { tag, size } = toRefs(props)
const toTag = (id: number) => {
	router.push({ name: 'tag', params: { id } })
}
</script>

<style lang="scss" scoped>
.article-tag {
	@include panel-styl(var(--el-color-primary), var(--el-color-primary-light-9));
}
</style>
