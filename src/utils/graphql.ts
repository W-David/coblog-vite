import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'
import { onError } from '@apollo/client/link/error'
import { setContext } from '@apollo/client/link/context'
import { from } from '@apollo/client/core'
import { logErrorMessages } from '@vue/apollo-util'

export function createApolloClient() {
	const authLink = setContext((_, { headers }) => {
		const token = encodeToken()
		return {
			headers: {
				...headers,
				authorization: token
			}
		}
	})
	const httpLink = createHttpLink({
		uri: import.meta.env.VITE_APP_BASE_URL + '/graphql'
	})
	const errorLink = onError(error => {
		const { graphQLErrors, networkError, operation } = error
		if (process.env.NODE_ENV === 'development') {
			logErrorMessages(error)
		}
		if (graphQLErrors) {
			ElMessage({
				type: 'error',
				showClose: false,
				duration: 3000,
				grouping: true,
				message: `出错啦(＃°Д°)`
			})
			console.error(`[${operation.operationName}]: ${graphQLErrors.slice(-1)[0].message}`)
		}
		if (networkError) {
			console.error(`[Network error]: ${networkError}`)
			ElMessage({
				type: 'error',
				showClose: false,
				duration: 3000,
				grouping: true,
				message: `出错啦w(ﾟДﾟ)w`
			})
			console.error(`[${operation.operationName}]: ${networkError.message}`)
		}
	})
	const link = from([errorLink, authLink, httpLink])
	const cache = new InMemoryCache()
	return new ApolloClient({
		link,
		cache
	})
}

export const singletonApolloClient = (function () {
	let instance: ApolloClient<any> | null = null
	return function () {
		if (!instance) {
			instance = createApolloClient()
		}
		return instance
	}
})()

export function onApolloContext(fn: () => any) {
	const apolloClient = singletonApolloClient()
	const onApolloContext = provideApolloClient(apolloClient)
	onApolloContext(() => fn())
}
