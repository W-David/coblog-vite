export { }

declare module 'vue-router' {
	interface RouteMeta {
		layout?: string,
		transitionName?: string
	}
}