<template>
	<div v-if="categoryList?.length" class="category-list-container">
		<div class="category-list-title">
			<i-custom-category class="title-icon" />
			<span class="title-text">分类</span>
		</div>
		<div class="category-list">
			<span v-if="isLogin" class="article-cate ctrl-btn" @click="handleAdd">
				<el-icon><i-ep-plus /></el-icon>
			</span>
			<span
				v-for="category in categoryList"
				:key="category.id"
				:class="['article-cate', isChecked(category.id) ? 'is-active' : '']"
				@click="handleChecked(category)"
			>
				{{ category.name }}
			</span>
		</div>
	</div>
</template>

<script lang="ts" setup>
const categoryStore = useCategory()
const adminStore = useAdmin()
const categoryList = computed(() => categoryStore.getCategoryList())
const checkedIds = computed(() => categoryStore.checkedCateIds)
const isChecked = (id: number) => checkedIds.value.includes(id)

const isLogin = computed(() => adminStore.isLogin)

const handleChecked = (item: Category) => {
	if (isChecked(item.id)) {
		const index = categoryStore.checkedCateIds.indexOf(item.id)
		categoryStore.checkedCateIds.splice(index, 1)
	} else {
		categoryStore.checkedCateIds.push(item.id)
	}
}

const handleAdd = () => {
	usePrompt({
		title: '请输入添加的种类名称',
		content: '添加种类',
		callback: async (value) => {
			const category = await categoryStore.CreateCategory({ name: value })
			return {
				success: !!category,
				msg: category ? `已添加${category.name}` : '添加失败',
			}
		},
	})
}
// 清空已选择的category
categoryStore.checkedCateIds.splice(0, categoryStore.checkedCateIds.length)
categoryStore.GetCategories()
</script>

<style lang="scss" scoped>
.category-list-container {
	// @include box-shadow(12px 12px 24px 0 rgba(0, 0, 0, 0.05));
	@include layout(100%, auto, 0, 4px);
	@include scroll-bar-reset(
		6px,
		auto,
		transparent,
		var(--el-border-color),
		3px
	);
	@include border(none, 8px);
	@include bg-color(#fff);
	box-shadow: var(--el-box-shadow);

	.category-list-title {
		@include layout(auto, auto, 0, 4px 8px);
		font-size: 16px;
		font-weight: bold;
		.title-icon {
			color: var(--el-color-success);
		}
		.title-text {
			margin-left: 4px;
		}
	}
	.category-list {
		@include layout(auto, auto, 0, 4px 8px 12px);
		@include flex-box(row, center, center, wrap);

		.article-cate {
			@include panel-styl(
				var(--el-color-success),
				var(--el-color-success-light-7)
			);
			&.ctrl-btn {
				@include panel-styl(var(--el-color-info), var(--el-color-info-light-7));
			}
		}
	}
}
</style>
