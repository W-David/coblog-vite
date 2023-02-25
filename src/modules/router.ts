import { setupLayouts } from 'virtual:meta-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import { routes as fileRoutes } from 'vue-router/auto/routes'
import installController from './controller'
import installNprogress from './nprogress'
import installTitle from './title'

const router = createRouter({
	history: createWebHistory(),
	scrollBehavior: async (to, from, savedPosition) => {
		// 不处理登录页
		if (to.name === 'login') {
			return false
		}
		//对于文章页面不处理，防止与原生的锚点定位冲突
		if (to.name === 'article' && from.name === 'article') {
			return false
		}
		await new Promise((res) => setTimeout(res, 500))
		if (savedPosition) {
			return { top: savedPosition.top, behavior: 'smooth' }
		} else {
			if (!to.name) {
				return { top: 0, behavior: 'smooth' }
			}
			const routeName = to.name
			const routeElMap: Record<string | symbol, string> = {
				'/': '.app-main-container',
				'/about': '.about-page',
				'/archive': '.archive-page',
				'/article': '.article-page',
				'/tag': '.tag-page',
				'/blog': '.blog-page',
				'/category': '.category-page',
			}
			const posElement = document.querySelector(routeElMap[routeName])
			if (!posElement) {
				return { top: 0, behavior: 'smooth' }
			}
			const top = getYPosition(posElement) - 80
			return { top, behavior: 'smooth' }
		}
	},
	routes: setupLayouts(fileRoutes),
})

installNprogress(router)
installTitle(router)
installController(router)

export default router
