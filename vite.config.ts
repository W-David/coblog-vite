import { resolve } from 'path'
import { defineConfig } from 'vite'
import generatePlugins from './presets/generatePlugins'

export default defineConfig({
	server: {
		host: '0.0.0.0',
		port: 8000,
		open: true
	},
	resolve: {
		alias: {
			'~/': `${resolve(__dirname, 'src')}/`
		}
	},
	css: {
		preprocessorOptions: {
			scss: {
				api: "modern-compiler",
				quietDeps: true,
				additionalData: `
					@use "~/styles/element/index.scss" as *;
					@use "~/styles/index.scss" as *;
				`
			}
		}
	},
	define: {
		__VUE_OPTIONS_API__: false // 明确不使用 options api
	},
	plugins: [generatePlugins()]
})
