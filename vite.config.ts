import { resolve } from 'path'
import { defineConfig } from 'vite'
import generatePlugins from './presets/generatePlugins'

export default defineConfig({
	resolve: {
		alias: {
			'~/': `${resolve(__dirname, 'src')}/`,
		},
	},
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `
					@use "~/styles/element/index.scss" as *;
					@use "~/styles/index.scss" as *;
				`,
			},
		},
	},
	define: {
		__VUE_OPTIONS_API__: false, // 明确不使用 options api
	},
	plugins: [generatePlugins()],
})
