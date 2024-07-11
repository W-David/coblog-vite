import { graphql } from '../generated'

export const graphqlLogin = graphql(`
	query Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			token
		}
	}
`)

export const graphqlAuth = graphql(`
	query Auth {
		auth {
			id
			email
			nickName
			createdAt
			avatar
			role
		}
	}
`)

export const users = graphql(`
	query Users {
		users {
			email
			id
			nickName
			role
			avatar
		}
	}
`)

export const getUser = graphql(`
	query GetUser($where: UserWhereUniqueInput!) {
		getUser(where: $where) {
			id
			email
			avatar
			role
			nickName
			createdAt
		}
	}
`)

export const getPost = graphql(`
	query GetPost($where: PostWhereUniqueInput!) {
		getPost(where: $where) {
			title
			content
			browNum
			published
			updatedAt
			createdAt
			description
			content
			favoNum
			authorId
			author {
				id
				nickName
				email
				createdAt
				avatar
				role
			}
			id
		}
	}
`)

export const posts = graphql(`
	query Posts(
		$where: PostWhereInput
		$orderBy: [PostOrderByWithRelationInput!]
		$cursor: PostWhereUniqueInput
		$take: Int
		$skip: Int
		$distinct: [PostScalarFieldEnum!]
	) {
		posts(where: $where, orderBy: $orderBy, cursor: $cursor, take: $take, skip: $skip, distinct: $distinct) {
			id
			createdAt
			updatedAt
			title
			description
			content
			published
			favoNum
			browNum
			authorId
			author {
				id
				nickName
				email
				avatar
				role
			}
		}
	}
`)

export const categories = graphql(`
	query Categories($where: CategoryWhereInput) {
		categories(where: $where) {
			id
			name
		}
	}
`)

export const getCategory = graphql(`
	query GetCategory($where: CategoryWhereUniqueInput!) {
		getCategory(where: $where) {
			name
			id
			CategoriesOnPosts {
				post {
					id
					createdAt
					updatedAt
					title
					description
					content
					published
					favoNum
					browNum
					authorId
				}
			}
		}
	}
`)

export const tags = graphql(`
	query Tags {
		tags {
			id
			name
		}
	}
`)

export const getTag = graphql(`
	query GetTag($where: TagWhereUniqueInput!) {
		getTag(where: $where) {
			name
			id
			TagsOnPosts {
				post {
					id
					createdAt
					updatedAt
					title
					description
					content
					published
					favoNum
					browNum
					authorId
				}
			}
		}
	}
`)
