<template>
	<default-layout>
		<div class="app-main-container">
			<el-row justify="center" :gutter="16">
				<el-col :sm="7" :md="6" :lg="5" :xl="5" class="hidden-xs-only">
					<div class="widget-list">
						<!-- article-hot -->
						<transition name="slide-fade-left" appear>
							<article-hot class="widget-item hidden-lg-and-up"></article-hot>
						</transition>
						<!-- article-recent -->
						<transition name="slide-fade-left" appear>
							<article-recent class="widget-item"></article-recent>
						</transition>
					</div>
					<div class="widget-list is-sticky">
						<!-- category-list -->
						<transition name="slide-fade-left" appear>
							<category-list class="widget-item"></category-list>
						</transition>
						<!-- tag-list -->
						<transition name="slide-fade-left" appear>
							<tag-list class="widget-item hidden-lg-and-up"></tag-list>
						</transition>
						<!-- links -->
						<transition name="slide-fade-left" appear>
							<links class="widget-item"></links>
						</transition>
					</div>
				</el-col>
				<el-col :xs="24" :sm="15" :md="16" :lg="12">
					<!-- main-content -->
					<router-view v-slot="{ Component, route }" class="widget-list">
						<transition :name="(route.meta as RouteMeta).transitionName">
							<component :is="Component" :key="route.path" />
						</transition>
					</router-view>
					<div class="widget-list">
						<transition name="fade" appear>
							<waline></waline>
						</transition>
					</div>
					<div class="widget-list hidden-sm-and-up">
						<!-- article-recent -->
						<transition name="fade" appear>
							<article-recent class="widget-item"></article-recent>
						</transition>
						<!-- tag-list -->
						<transition name="fade" appear>
							<tag-list class="widget-item"></tag-list>
						</transition>
						<!-- category-list -->
						<transition name="fade" appear>
							<category-list class="widget-item"></category-list>
						</transition>
						<!-- article-hot -->
						<transition name="fade" appear>
							<article-hot class="widget-item"></article-hot>
						</transition>
						<!-- links -->
						<transition name="fade" appear>
							<links class="widget-item"></links>
						</transition>
					</div>
				</el-col>
				<el-col :lg="5" class="hidden-md-and-down">
					<div class="widget-list">
						<!-- article-hot -->
						<transition name="slide-fade-right" appear>
							<article-hot class="widget-item"></article-hot>
						</transition>
					</div>
					<div class="widget-list is-sticky">
						<!-- tag-list -->
						<transition name="slide-fade-right" appear>
							<tag-list class="widget-item"></tag-list>
						</transition>
					</div>
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
	@include slide-fade-left;
	@include slide-fade-right;
	@include widget-styl;
	z-index: 1000;
}
</style>
