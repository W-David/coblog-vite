<template>
	<div class="selected-list-container">
		<el-card v-loading="loading" shadow="never" class="checkbox-card">
			<div v-if="list && list.length">
				<el-check-tag
					v-for="item in list"
					:key="item.id"
					:checked="isChecked(item)"
					@change="handleCheckChange(item)"
				>
					{{ item.name }}
				</el-check-tag>
			</div>
			<div v-else>
				<span class="empty-hint">这里还空空如也(┬┬﹏┬┬)</span>
			</div>
		</el-card>
	</div>
</template>

<script lang="ts" setup>
const props = withDefaults(
	defineProps<{
		loading: boolean
		isShow: boolean
		list: Category[] | Tag[]
		checkedArr: Category[] | Tag[]
	}>(),
	{
		loading: false,
	}
)
const { loading, isShow, list } = toRefs(props)
const emit = defineEmits<{
	(e: 'update:checkedArr', value: Category[] | Tag[]): void
}>()
const checkedList = ref<Category[] | Tag[]>([])

watch(isShow, (nv, ov) => {
	if (!nv && ov) {
		checkedList.value = []
		emit('update:checkedArr', [])
	}
})

const isChecked = (item: Category | Tag) =>
	checkedList.value.some((it) => it.id === item.id)

const handleCheckChange = (item: Category | Tag) => {
	if (isChecked(item)) {
		checkedList.value = checkedList.value.filter((it) => it.id !== item.id)
	} else {
		checkedList.value.push(item)
	}
	emit('update:checkedArr', [...checkedList.value])
}
</script>

<style lang="scss" scoped>
.selected-list-container {
	@include layout(auto, auto, 0, 0);
	.checkbox-card {
		&:deep {
			.el-card__body {
				padding: 16px;
				.el-check-tag {
					margin: 8px 12px 0 0;
				}
			}
		}
		.empty-hint {
			@include font-hei;
			color: var(--el-color-danger);
			font-size: 18px;
			font-weight: bold;
		}
	}
}
</style>
