import { useNProgress } from '@vueuse/integrations/useNProgress'
import type { RouterTyped } from 'vue-router/auto'

// https://vueuse.org/integrations/useNProgress/
export default (router: RouterTyped) => {
	const { isLoading } = useNProgress()

	router.beforeEach(() => {
		isLoading.value = true
	})
	router.afterEach(() => {
		isLoading.value = false
	})
}
