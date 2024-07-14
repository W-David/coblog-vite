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
	query Categories(
		$where: CategoryWhereInput
		$orderBy: [CategoryOrderByWithRelationInput!]
		$cursor: CategoryWhereUniqueInput
		$take: Int
		$skip: Int
		$distinct: [CategoryScalarFieldEnum!]
	) {
		categories(where: $where, orderBy: $orderBy, cursor: $cursor, take: $take, skip: $skip, distinct: $distinct) {
			id
			name
		}
	}
`)

export const getCategoriesWithPosts = graphql(`
	query CategoriesWithPosts(
		$orderBy: [CategoryOrderByWithRelationInput!]
		$cursor: CategoryWhereUniqueInput
		$take: Int
		$skip: Int
		$categoriesOnPostOrderBy: [CategoriesOnPostsOrderByWithRelationInput!]
		$categoriesOnPostTake: Int
	) {
		categories(orderBy: $orderBy, cursor: $cursor, take: $take, skip: $skip) {
			id
			name
			createdAt
			updatedAt
			CategoriesOnPosts(orderBy: $categoriesOnPostOrderBy, take: $categoriesOnPostTake) {
				post {
					id
					title
					createdAt
					updatedAt
				}
			}
		}
	}
`)

export const getCategory = graphql(`
	query GetCategory(
		$where: CategoryWhereUniqueInput!
		$orderBy: [CategoriesOnPostsOrderByWithRelationInput!]
		$take: Int
		$cursor: CategoriesOnPostsWhereUniqueInput
		$skip: Int
	) {
		getCategory(where: $where) {
			id
			name
			createdAt
			updatedAt
			CategoriesOnPosts(orderBy: $orderBy, take: $take, cursor: $cursor, skip: $skip) {
				post {
					id
					title
					updatedAt
					favoNum
					description
					createdAt
					browNum
					published
					authorId
				}
			}
		}
	}
`)

export const tags = graphql(`
	query Tags(
		$where: TagWhereInput
		$orderBy: [TagOrderByWithRelationInput!]
		$cursor: TagWhereUniqueInput
		$take: Int
		$skip: Int
		$distinct: [TagScalarFieldEnum!]
	) {
		tags(where: $where, orderBy: $orderBy, cursor: $cursor, take: $take, skip: $skip, distinct: $distinct) {
			id
			name
		}
	}
`)

export const getTagsWithPosts = graphql(`
	query TagsWithPosts(
		$orderBy: [TagOrderByWithRelationInput!]
		$cursor: TagWhereUniqueInput
		$take: Int
		$skip: Int
		$tagsOnPostOrderBy: [TagsOnPostsOrderByWithRelationInput!]
		$tagsOnPostTake: Int
	) {
		tags(orderBy: $orderBy, cursor: $cursor, take: $take, skip: $skip) {
			id
			name
			createdAt
			updatedAt
			TagsOnPosts(orderBy: $tagsOnPostOrderBy, take: $tagsOnPostTake) {
				post {
					id
					title
					createdAt
					updatedAt
				}
			}
		}
	}
`)

export const getTag = graphql(`
	query GetTag($where: TagWhereUniqueInput!, $orderBy: [TagsOnPostsOrderByWithRelationInput!], $take: Int, $cursor: TagsOnPostsWhereUniqueInput, $skip: Int) {
		getTag(where: $where) {
			id
			name
			createdAt
			updatedAt
			TagsOnPosts(orderBy: $orderBy, take: $take, cursor: $cursor, skip: $skip) {
				post {
					id
					title
					updatedAt
					favoNum
					description
					createdAt
					browNum
					published
					authorId
				}
			}
		}
	}
`)
