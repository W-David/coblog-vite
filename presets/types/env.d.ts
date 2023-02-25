/// <reference types="vite/client" />
/// <reference types="vite-plugin-use-modules/client" />
/// <reference types="unplugin-vue-macros/macros-global" />
/// <reference types="vite-plugin-vue-meta-layouts/client" />
/// <reference types="@intlify/vite-plugin-vue-i18n/client" />
/// <reference types="unplugin-icons/types/vue" />

declare module "*.vue" {
	import type { DefineComponent } from "vue"
	const component: DefineComponent<{}, {}, any>
	export default component
}

declare module "*.md" {
	import { ComponentOptions } from "vue"
	const Component: ComponentOptions
	export default Component
}

declare interface Window {
	particlesJS: any
}

declare module 'vue-router' {
	interface RouteMeta {
		layout?: string,
		transitionName?: string
	}
}

declare module "device.js";
declare module "@waline/client/component"
declare module "axios/lib/adapters/adapters"
declare module "@kangc/v-md-editor"
declare module "prismjs"