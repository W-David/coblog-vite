<template>
	<div class="waline-comp-container">
		<waline
			:server-u-r-l="serverURL"
			:path="path"
			:lang="lang"
			:dark="dark"
			:reaction="reaction"
			:copyright="copyright"
		/>
	</div>
</template>

<script lang="ts" setup>
import { Waline } from '@waline/client/component'
import '@waline/client/dist/waline.css'

const route = useRoute()
const serverURL = import.meta.env.VITE_APP_WALINE_API
const lang = 'zh-CN'
const dark = '.dark'
const reaction = true
const copyright = false
const path = computed(() => route.path)
</script>

<style lang="scss" scoped>
.waline-comp-container {
	@include layout(100%, auto, $main-margin 0 0 0, 8px 12px);
	@include border(1px solid #eee, 8px);
	@include box-shadow(4px 4px 16px rgba(0, 0, 0, 0.1));
	@include bg-color(#fafafa, #1f1f1f);
}
</style>
