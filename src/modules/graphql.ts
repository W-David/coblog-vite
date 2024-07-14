import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'
import { onError } from '@apollo/client/link/error'
import { from } from '@apollo/client/core'
import { logErrorMessages } from '@vue/apollo-util'

export function createApolloClient() {
	const httpLink = createHttpLink({
		uri: import.meta.env.VITE_APP_BASE_URL + '/graphql'
	})
	const errorLink = onError(error => {
		if (process.env.NODE_ENV === 'development') {
			logErrorMessages(error)
		} else {
			const { graphQLErrors, networkError, operation } = error
			if (graphQLErrors) {
				graphQLErrors.forEach(({ message, locations, path }) => {
					console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
				})
				ElMessage({
					type: 'error',
					showClose: false,
					duration: 1000,
					grouping: true,
					message: `出错啦(＃°Д°), [${operation.operationName}]: ${graphQLErrors.slice(-1)[0].message}`
				})
			}
			if (networkError) {
				console.error(`[Network error]: ${networkError}`)
				ElMessage({
					type: 'error',
					showClose: false,
					duration: 1000,
					grouping: true,
					message: `出错啦w(ﾟДﾟ)w, [${operation.operationName}]: ${networkError.message}`
				})
			}
		}
	})
	const link = from([errorLink, httpLink])
	const cache = new InMemoryCache()
	return new ApolloClient({
		link,
		cache
	})
}
