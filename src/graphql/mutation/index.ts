export const graphqlRegister = gql`
	mutation Register($email: String!, $password: String!, $role: String!) {
		register(email: $email, password: $password, role: $role) {
			token
		}
	}
`

export const deleteOneUser = gql`
	mutation DeleteOneUser($where: UserWhereUniqueInput!) {
		deleteOneUser(where: $where) {
			id
			email
			nickName
			avatar
		}
	}
`

export const updateOneUser = gql`
	mutation UpdateOneUser($data: UserUpdateInput!, $where: UserWhereUniqueInput!) {
		updateOneUser(data: $data, where: $where) {
			id
			email
			nickName
			avatar
			role
		}
	}
`

export const createOnePost = gql`
	mutation CreateOnePost($data: PostCreateInput!) {
		createOnePost(data: $data) {
			id
			title
			authorId
		}
	}
`

export const updateOnePost = gql`
	mutation UpdateOnePost($data: PostUpdateInput!, $where: PostWhereUniqueInput!) {
		updateOnePost(data: $data, where: $where) {
			id
		}
	}
`

export const createOneCategory = gql`
	mutation CreateOneCategory($data: CategoryCreateInput!) {
		createOneCategory(data: $data) {
			id
			name
		}
	}
`

export const deleteOnePost = gql`
	mutation DeleteOnePost($where: PostWhereUniqueInput!) {
		deleteOnePost(where: $where) {
			id
		}
	}
`

export const deleteOneCategory = gql`
	mutation DeleteOneCategory($where: CategoryWhereUniqueInput!) {
		deleteOneCategory(where: $where) {
			id
			name
		}
	}
`

export const updateOneTag = gql`
	mutation UpdateOneTag($data: TagUpdateInput!, $where: TagWhereUniqueInput!) {
		updateOneTag(data: $data, where: $where) {
			id
			name
		}
	}
`

export const deleteOneTag = gql`
	mutation DeleteOneTag($where: TagWhereUniqueInput!) {
		deleteOneTag(where: $where) {
			id
			name
		}
	}
`

export const search = gql`
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
`
