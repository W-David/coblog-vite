import type { RouterTyped } from 'vue-router/auto'

const whiteList = ['login', '/', 'article', 'tag', 'category', 'about']
const redirectList = ['login']

export default (router: RouterTyped) => {
	router.beforeEach(async to => {
		const adminStore = useAdmin()
		const token = getToken() || ''
		const isLogin = adminStore.isLogin

		const needRedirect = redirectList.includes(to.name)
		const isWhiteList = whiteList.includes(to.name)

		if (token) {
			//登录过，存在token
			if (isLogin) {
				if (needRedirect) {
					return { name: '/' }
				} else {
					return
				}
			} else {
				const res = await adminStore.GetInfo()
				if (res.data.code === 200 && res.data.data) {
					ElMessage({
						type: 'success',
						message: `欢迎回来，${res.data.data.nickname}`,
						showClose: false
					})
					return { name: '/' }
				} else {
					return { name: 'login' }
				}
			}
		} else {
			// 没有登录信息
			if (!isWhiteList) {
				// ElMessage({ showClose: false, type: 'warning', message: `请先登录` })
				return { name: 'login' }
			} else {
				return
			}
		}
	})
}
