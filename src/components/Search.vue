<template>
	<div class="search-container">
		<el-autocomplete
			v-model="queryText"
			:fetch-suggestions="querySearch"
			clearable
			:debounce="500"
			:highlight-first-item="true"
			:fit-input-width="true"
			:teleported="true"
			placeholder="标题 / 标签 / 类别"
			@select="handleQuery">
			<template #suffix>
				<el-icon @click="handleQuery"><i-ep-search /></el-icon>
			</template>
			<template #default="{ item }">
				<div class="ac-content">
					<div class="ac-type">
						<i-custom-article
							v-if="item.type === 'article'"
							class="svg-article" />
						<i-custom-tag
							v-else-if="item.type === 'tag'"
							class="svg-tag" />
						<i-custom-category
							v-else
							class="svg-category" />
					</div>
					<div class="ac-val">{{ item.value }}</div>
				</div>
			</template>
		</el-autocomplete>
	</div>
</template>

<script lang="ts" setup>
const router = useRouter()
const queryText = ref('')
const handleQuery = (data: Record<string, any>) => {
	const { type, id } = data as SearchType
	router.push({ name: `${type}`, params: { id } })
}
const querySearch = async (qs: string, callback: (results: Record<string, any>[]) => void) => {
	if (!qs) {
		return Promise.resolve([])
	}
	const res = await navbarSearch(qs)
	if (res.data.code === 200 && res.data.data?.length) {
		const results = res.data.data ?? []
		callback(results)
		return results
	} else {
		callback([])
		return []
	}
}
</script>

<style lang="scss" scoped>
.search-container {
	&:deep {
		.el-input {
			width: 180px;
			.el-input__wrapper {
				border-radius: 16px;
				.el-input__suffix {
					.el-icon {
						color: #ccc;
						cursor: pointer;
						&:hover {
							color: var(--el-color-primary);
						}
					}
				}
			}
		}
	}
}
</style>
