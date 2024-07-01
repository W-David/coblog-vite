import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'
import { onError } from '@apollo/client/link/error'
import { from } from '@apollo/client'

export function createApolloClient() {
	const httpLink = createHttpLink({
		uri: 'http://localhost:3000/graphql'
	})
	const errorLink = onError(({ graphQLErrors, networkError }) => {
		if (graphQLErrors) {
			graphQLErrors.forEach(({ message, locations, path }) => {
				console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
			})
		}
		if (networkError) {
			console.error(`[Network error]: ${networkError}`)
		}
	})
	const link = from([errorLink, httpLink])
	const cache = new InMemoryCache()
	return new ApolloClient({
		link,
		cache
	})
}
