<template>
	<div class="tag-list-container">
		<div class="tag-list-title">
			<i-custom-tag class="title-icon" />
			<span class="title-text">标签</span>
		</div>
		<div class="tag-list">
			<el-skeleton
				:loading="loading"
				animated
				:count="12">
				<template #template>
					<el-skeleton-item
						variant="text"
						class="skeleton-item"
						:style="{ width: `${getRandomWidth()}px` }"></el-skeleton-item>
				</template>
				<template #default>
					<span
						v-if="isLogin"
						class="article-tag ctrl-btn"
						@click="handleAdd">
						<el-icon><i-ep-plus /></el-icon>
					</span>
					<span
						v-for="tag in tagList"
						:key="tag.id"
						:class="['article-tag', isChecked(tag.id) ? 'is-active' : '']"
						@click="handleChecked(tag)">
						{{ tag.name }}
					</span>
				</template>
			</el-skeleton>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { getRandomItem } from '~/utils/format'

const tagStore = useTag()
const adminStore = useAdmin()
const tagList = computed(() => tagStore.getTagList())
const checkedIds = computed(() => tagStore.getCheckedTagIds)
const isChecked = (id: number) => checkedIds.value.includes(id)
const loading = ref(true)

const isLogin = computed(() => adminStore.isLogin)

const handleChecked = (item: Tag) => {
	if (isChecked(item.id)) {
		const index = tagStore.checkedTagIds.indexOf(item.id)
		tagStore.checkedTagIds.splice(index, 1)
	} else {
		tagStore.checkedTagIds.push(item.id)
	}
}
const handleAdd = () => {
	usePrompt({
		title: '请输入添加的标签名称',
		content: '添加标签',
		callback: async value => {
			const tag = await tagStore.CreateTag({ name: value })
			return {
				success: !!tag,
				msg: tag ? `${tag.name}已添加` : '添加失败'
			}
		}
	})
}

// const handleDelete = (tag: Tag) => {
// 	tagStore.DelTag(tag.id)
// }
//清空已选择的 tag
const init = async () => {
	tagStore.checkedTagIds.splice(0, tagStore.checkedTagIds.length)
	await tagStore.GetTags()
	loading.value = false
}
const getRandomWidth = () => {
	const widthList = [48, 64]
	return getRandomItem(widthList)
}
init()
</script>

<style lang="scss" scoped>
.tag-list-container {
	// @include box-shadow(12px 12px 24px 0 rgba(0, 0, 0, 0.05));
	@include layout(100%, auto, 0, 4px);
	@include scroll-bar-reset(6px, auto, transparent, var(--el-border-color), 3px);
	@include border(none, 8px);
	@include bg-color(#fff);
	box-shadow: var(--el-box-shadow);
	.tag-list-title {
		@include layout(auto, auto, 0, 4px 8px);
		font-size: 16px;
		font-weight: bold;
		.title-icon {
			color: var(--el-color-primary);
		}
		.title-text {
			margin-left: 4px;
		}
	}
	.tag-list {
		@include layout(auto, auto, 0, 4px 8px 12px);
		@include flex-box(row, center, center, wrap);

		.skeleton-item {
			@include layout(auto, 22px, 6px, 0);
			border-radius: 11px;
		}
		.article-tag {
			@include panel-styl(var(--el-color-primary), var(--el-color-primary-light-9));
			&.ctrl-btn {
				@include panel-styl(var(--el-color-info), var(--el-color-info-light-7));
			}
		}
	}
}
</style>
