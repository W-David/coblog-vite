import type { App, Directive } from 'vue'
import LazyLoad from './lazyLoad'
// 自定义指令
const directives: Record<string, Directive> = {
	LazyLoad
}
export default {
	install(app: App) {
		Object.keys(directives).forEach(key => {
			app.directive(key, directives[key])
		})
	}
}
