export const login = gql`
	query Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			token
		}
	}
`

export const auth = gql`
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
`

export const users = gql`
	query Users {
		users {
			email
			id
			nickName
			role
			avatar
		}
	}
`

export const getUser = gql`
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
`

export const getPost = gql`
	query GetPost($where: PostWhereUniqueInput!) {
		getPost(where: $where) {
			title
			content
			browNum
			published
			updatedAt
			createdAt
			description
			favoNum
			authorId
			author {
				nickName
				email
				createdAt
				role
			}
			id
		}
	}
`

export const posts = gql`
	query Posts($orderBy: [PostOrderByWithRelationInput!]) {
		posts(orderBy: $orderBy) {
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
`

export const categories = gql`
	query Categories($where: CategoryWhereInput) {
		categories(where: $where) {
			id
			name
		}
	}
`

export const getCategory = gql`
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
`

export const tags = gql`
	query Tags {
		tags {
			id
			name
		}
	}
`

export const getTag = gql`
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
`
