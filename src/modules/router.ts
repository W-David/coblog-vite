import { setupLayouts } from 'virtual:meta-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import type { RouterTyped } from 'vue-router/auto'
import type { RouteNamedMap } from 'vue-router/auto/routes'
import { routes as fileRoutes } from 'vue-router/auto/routes'
import installController from './controller'
import installNprogress from './nprogress'
import installTitle from './title'

const router = createRouter({
	history: createWebHistory(),
	scrollBehavior: async (to, from, savedPosition) => {
		const toRouteName = to.name?.toString() as keyof RouteNamedMap
		console.log(`running scrollBehavior...`)
		console.log(
			`to is ${toRouteName}, from is ${from.name?.toString()}, savedPosition is ${
				savedPosition?.top
			}`
		)
		//排除意外路由
		if (!toRouteName) {
			return false
		}
		if (toRouteName === 'notFound') {
			return false
		}
		// 不处理登录页
		if (toRouteName === 'login') {
			return false
		}
		if (toRouteName === 'article') {
			//对于文章页面自身的跳转不处理，防止与原生的锚点定位冲突
			if (from.name === 'article') {
				return false
			} else {
				return { top: 0, behavior: 'smooth' }
			}
		}
		await new Promise((res) => setTimeout(res, 500))
		if (savedPosition) {
			return { top: savedPosition.top, behavior: 'smooth' }
		} else {
			// const routeElMap: Omit<
			// 	Record<keyof RouteNamedMap, string>,
			// 	'login' | 'notFound' | 'article'
			// > = {
			// 	'/': '.app-main-container',
			// 	about: '.about-page',
			// 	archive: '.archive-page',
			// 	tag: '.tag-page',
			// 	blog: '.blog-page',
			// 	category: '.category-page',
			// }
			// const posElement = document.querySelector(routeElMap[toRouteName])
			// if (!posElement) {
			// 	return { top: 0, behavior: 'smooth' }
			// }
			// const top = getYPosition(posElement) - 80
			// console.log(
			// 	`current router:  ${toRouteName}, top is ${top}, exit scrollBehavior`
			// )
			console.log(
				`current router:  ${toRouteName}, top is 0, exit scrollBehavior`
			)
			return { top: 0, behavior: 'smooth' }
		}
	},
	routes: setupLayouts(fileRoutes),
}) as RouterTyped

installNprogress(router)
installTitle(router)
installController(router)

export default router
