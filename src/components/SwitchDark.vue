<template>
	<div class="switch-dark-container">
		<el-switch
			:model-value="modelValue"
			inline-prompt
			style="--el-switch-on-color: #1d1d1d; --el-switch-off-color: #d1d1d1"
			@change="change"
		/>
	</div>
</template>

<script lang="ts" setup>
type SwitchModelType = boolean | string | number
const props = withDefaults(
	defineProps<{
		modelValue: SwitchModelType
	}>(),
	{
		modelValue: false,
	}
)
const { modelValue } = toRefs(props)
const emit = defineEmits<{
	(e: 'update:modelValue', value: SwitchModelType): void
}>()
const change = (val: SwitchModelType) => emit('update:modelValue', val)
</script>

<style lang="scss" scoped>
.switch-dark-container {
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
