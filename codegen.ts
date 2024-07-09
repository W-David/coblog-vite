import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
	schema: [
		{
			'http://localhost:3000/graphql': {
				headers: {
					Authorization:
						'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoicm9vdCIsImVtYWlsIjoicm9vdEByb290LmNvbSIsInJvbGUiOiJST09UIiwiaWF0IjoxNzE5NDUzNTcxLCJleHAiOjE3MjIwNDU1NzF9.FcCRV9-DbLxIp7EmXNuO7QiQV6TlVRxam3Kgpx-HaX4'
				}
			}
		}
	],
	watch: false,
	documents: ['src/**/*.vue', 'src/**/*.ts'],
	ignoreNoDocuments: true, // for better experience with the watcher
	generates: {
		'./src/graphql/generated/': {
			preset: 'client',
			config: {
				useTypeImports: true
			}
		}
	}
}

export default config
