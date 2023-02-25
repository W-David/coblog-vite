import type { RouterTyped } from 'vue-router/auto'

export default (router: RouterTyped) => {
	router.beforeEach((r) => {
		const originTitle = import.meta.env.VITE_APP_TITLE
		const title = computed(() =>
			r.path === '/'
				? `${originTitle} · home`
				: originTitle + r.path.replaceAll('/', ' · ')
		)
		useTitle(title)
	})
}
