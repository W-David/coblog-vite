import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'

export function createApolloClient() {
	const httpLink = createHttpLink({
		uri: 'http://localhost:3000/graphql'
	})
	const cache = new InMemoryCache()
	return new ApolloClient({
		link: httpLink,
		cache
	})
}
