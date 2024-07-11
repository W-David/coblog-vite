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
