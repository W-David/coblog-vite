import { graphql } from '../generated'

export const graphqlRegister = graphql(`
	mutation Register($email: String!, $password: String!, $role: String!) {
		register(email: $email, password: $password, role: $role) {
			token
		}
	}
`)

export const deleteOneUser = graphql(`
	mutation DeleteOneUser($where: UserWhereUniqueInput!) {
		deleteOneUser(where: $where) {
			id
			email
			nickName
			avatar
		}
	}
`)

export const updateOneUser = graphql(`
	mutation UpdateOneUser($data: UserUpdateInput!, $where: UserWhereUniqueInput!) {
		updateOneUser(data: $data, where: $where) {
			id
			email
			nickName
			avatar
			role
		}
	}
`)

export const createOnePost = graphql(`
	mutation CreateOnePost($data: PostCreateInput!) {
		createOnePost(data: $data) {
			id
			title
			authorId
		}
	}
`)

export const updateOnePost = graphql(`
	mutation UpdateOnePost($data: PostUpdateInput!, $where: PostWhereUniqueInput!) {
		updateOnePost(data: $data, where: $where) {
			id
		}
	}
`)

export const createOneCategory = graphql(`
	mutation CreateOneCategory($data: CategoryCreateInput!) {
		createOneCategory(data: $data) {
			id
			name
		}
	}
`)

export const deleteOnePost = graphql(`
	mutation DeleteOnePost($where: PostWhereUniqueInput!) {
		deleteOnePost(where: $where) {
			id
		}
	}
`)

export const deleteOneCategory = graphql(`
	mutation DeleteOneCategory($where: CategoryWhereUniqueInput!) {
		deleteOneCategory(where: $where) {
			id
			name
		}
	}
`)

export const updateOneTag = graphql(`
	mutation UpdateOneTag($data: TagUpdateInput!, $where: TagWhereUniqueInput!) {
		updateOneTag(data: $data, where: $where) {
			id
			name
		}
	}
`)

export const deleteOneTag = graphql(`
	mutation DeleteOneTag($where: TagWhereUniqueInput!) {
		deleteOneTag(where: $where) {
			id
			name
		}
	}
`)

export const search = graphql(`
	query Search($where: PostWhereInput, $categoriesWhere: CategoryWhereInput, $tagsWhere: TagWhereInput) {
		posts(where: $where) {
			title
		}
		categories(where: $categoriesWhere) {
			name
		}
		tags(where: $tagsWhere) {
			name
		}
	}
`)
