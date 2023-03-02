<template>
	<div class="pagination-container">
		<el-pagination
			v-model:current-page="currentPage"
			v-model:page-size="pageSize"
			:background="background"
			:layout="layout"
			:total="total"
			v-bind="$attrs"
			:pager-count="5"
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
		/>
	</div>
</template>

<script lang="ts" setup>
const props = withDefaults(
	defineProps<{
		total?: number
		page?: number
		limit?: number
		layout?: string
		background?: boolean
		autoScroll?: boolean
	}>(),
	{
		total: 0,
		page: 1,
		limit: 10,
		layout: 'prev, pager, next',
		background: true,
		autoScroll: true,
	}
)
const { total, page, limit, layout, background, autoScroll } = toRefs(props)
const emit = defineEmits<{
	(e: 'update:page', page: number): void
	(e: 'update:limit', limit: number): void
	(e: 'pagination', params: { page: number; limit: number }): void
}>()
const currentPage = computed({
	get: () => page.value,
	set: (val) => emit('update:page', val),
})
const pageSize = computed({
	get: () => limit.value,
	set: (val) => emit('update:limit', val),
})
const handleSizeChange = (val: number) => {
	emit('pagination', { page: currentPage.value, limit: val })
	if (autoScroll.value) {
		console.log('pagination scroll')
		nextTick(() => {
			window.scrollTo({ top: 0, behavior: 'smooth' })
		})
	}
}
const handleCurrentChange = (val: number) => {
	emit('pagination', { page: val, limit: pageSize.value })
	if (autoScroll.value) {
		console.log('pagination scroll')
		nextTick(() => {
			window.scrollTo({ top: 0, behavior: 'smooth' })
		})
	}
}
</script>

<style lang="scss" scoped>
.pagination-container {
	padding: 16px 8px;
	text-align: center;
}
</style>
