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
				try {
					const adminInfo = await adminStore.GetInfo()
					ElMessage({
						type: 'success',
						message: `欢迎回来，${adminInfo?.nickname || adminInfo.email}`,
						showClose: false
					})
					return { name: '/' }
				} catch (error) {
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
