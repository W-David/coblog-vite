<template>
	<default-layout>
		<div class="app-main-container">
			<el-row justify="center" :gutter="16">
				<el-col :xs="24" :sm="22" :md="20" :lg="16">
					<!-- main-content -->
					<router-view v-slot="{ Component, route }" class="widget-list">
						<transition :name="(route.meta as RouteMeta).transitionName">
							<component :is="Component" :key="route.path" />
						</transition>
					</router-view>
				</el-col>
			</el-row>
		</div>
	</default-layout>
</template>

<script lang="ts" setup>
import type { RouteMeta } from 'vue-router'
import DefaultLayout from './default.vue'
</script>

<style lang="scss" scoped>
.app-main-container {
	@include layout(100%, 100%, 0, $main-margin);
	@include fade;
	z-index: 1000;
}
</style>
