<template>
	<div
		class="article-cate"
		:style="style"
		@click.stop="toCategory(category.id)">
		<el-icon :size="size"><i-ep-folder-opened /></el-icon>
		{{ category.name }}
	</div>
</template>

<script lang="ts" setup>
const router = useRouter()
const props = withDefaults(
	defineProps<{
		category: Category
		size?: number
	}>(),
	{
		size: 16
	}
)
const { category, size } = toRefs(props)
const style = reactive({
	fontSize: `${size.value}px`,
	height: `${size.value * 2}px`,
	lineHeight: `${size.value * 2}px`,
	borderRadius: `${size.value}px`
})
const toCategory = (id: number) => {
	router.push({ name: 'category', params: { id } })
}
</script>

<style lang="scss" scoped>
.article-cate {
	@include panel-styl(var(--el-color-success), var(--el-color-success-light-7));
}
</style>
