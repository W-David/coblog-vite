export const postToArticle = (post: any) => {
	return {
		id: post.id,
		title: post.title,
		description: post.description || '',
		banner: {
			id: 0,
			path: ''
		},
		adminId: post.authorId.toString(),
		admin: {
			id: post.author.id,
			nickname: post.author.nickName || '',
			avatar: post.author.avatar || '',
			email: post.author.email
		},
		browse: post.browNum,
		createdAt: post.createdAt,
		status: 0
	}
}

export const categoriesToCategoryArticle = (category: {
	__typename?: 'Category'
	createdAt: any
	id: number
	name: string
	updatedAt: any
	CategoriesOnPosts: Array<{
		__typename?: 'CategoriesOnPosts'
		post?: {
			__typename?: 'Post'
			id: number
			title: string
			createdAt: any
			updatedAt: any
		} | null
	}>
}): CategoryArticle => {
	return {
		id: category.id,
		name: category.name,
		createdAt: category.createdAt,
		updatedAt: category.updatedAt,
		articles: category.CategoriesOnPosts.map(item => {
			if (item.post) {
				return {
					id: item.post.id,
					title: item.post.title,
					createdAt: item.post.createdAt,
					updatedAt: item.post.updatedAt
				}
			}
			return {
				id: 0,
				title: '',
				createdAt: '',
				updatedAt: ''
			}
		})
	}
}

export const tagsToTagArticle = (tag: {
	__typename?: 'Tag'
	createdAt: any
	name: string
	id: number
	updatedAt: any
	TagsOnPosts: Array<{
		__typename?: 'TagsOnPosts'
		post?: {
			__typename?: 'Post'
			id: number
			title: string
			createdAt: any
			updatedAt: any
		} | null
	}>
}): TagArticle => {
	return {
		id: tag.id,
		name: tag.name,
		createdAt: tag.createdAt,
		updatedAt: tag.updatedAt,
		articles: tag.TagsOnPosts.map(item => {
			if (item.post) {
				return {
					id: item.post.id,
					title: item.post.title,
					createdAt: item.post.createdAt,
					updatedAt: item.post.updatedAt
				}
			}
			return {
				id: 0,
				title: '',
				createdAt: '',
				updatedAt: ''
			}
		})
	}
}
