import type { App, Directive } from 'vue'
import LazyLoad from './lazyLoad'
import ShowOn from './showOn'
// 自定义指令
const directives: Record<string, Directive> = {
	LazyLoad,
	ShowOn
}
export default {
	install(app: App) {
		Object.keys(directives).forEach(key => {
			app.directive(key, directives[key])
		})
	}
}
