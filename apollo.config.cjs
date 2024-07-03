module.exports = {
	client: {
		service: {
			name: 'coblog-graphql',
			url: 'http://localhost:3000/graphql',
			headers: {
				authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoicm9vdCIsImVtYWlsIjoicm9vdEByb290LmNvbSIsInJvbGUiOiJST09UIiwiaWF0IjoxNzE5NDUzNTcxLCJleHAiOjE3MjIwNDU1NzF9.FcCRV9-DbLxIp7EmXNuO7QiQV6TlVRxam3Kgpx-HaX4'
			}
		},
		includes: ['src/graphql/**/*.ts']
	},
}
