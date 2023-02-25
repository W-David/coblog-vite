import pinia from '~/modules/pinia'
const aliossStore = useAlioss(pinia)
const appStore = useApp(pinia)

export default defineStore('useAdmin', {
	state: (): {
		adminInfo: AdminInfo
		avatar: string
		isLogin: boolean
	} => ({
		adminInfo: {
			id: 0,
			nickname: '',
			email: '',
		},
		avatar: '',
		isLogin: false,
	}),
	getters: {},
	actions: {
		async SetAvatar(file: File) {
			const sts = aliossStore.sts
			const client = getOssClient(sts)
			const res = await client.put(file.name, file)
			if (res.res.status === 200) {
				const url = res.url
				this.avatar = url
				await updateAdmin({ ...this.adminInfo, avatar: url })
				return url
			} else {
				return ''
			}
		},
		async DeleteAvatar() {
			this.avatar = ''
			const deleteRes = await updateAdmin({ ...this.adminInfo, avatar: '' })
			return deleteRes.data.code === 200
		},
		async SetAdminInfo(adminInfo: AdminInfo) {
			const { id, nickname, email } = adminInfo
			this.adminInfo = { id, nickname, email }
			const res = await updateAdmin({
				...this.adminInfo,
				avatar: this.avatar,
			})
			return res.data.data
		},
		async Login(params = {}) {
			const res = await login(params)
			if (res.data.code === 200 && res.data.data) {
				const admin = res.data.data
				const { id, nickname, email, token, avatar } = admin
				this.isLogin = true
				this.avatar = avatar || ''
				this.adminInfo = {
					id,
					nickname,
					email,
				}
				appStore.sidebarOpen = false
				setToken(token as string)
			} else {
				this.Logout()
			}
			return res
		},
		async Register(params = {}) {
			const res = await register(params)
			if (res.data.code === 200 && res.data.data) {
				const admin = res.data.data
				const { id, nickname, email, token } = admin
				this.isLogin = true
				this.adminInfo = {
					id,
					nickname,
					email,
				}
				appStore.sidebarOpen = false
				setToken(token as string)
			} else {
				this.Logout()
			}
			return res
		},
		async GetInfo() {
			const res = await auth()
			if (res.data.code === 200 && res.data.data) {
				const admin = res.data.data || {}
				const { id, nickname, email, avatar } = admin
				this.isLogin = true
				this.avatar = avatar || ''
				this.adminInfo = {
					id,
					nickname,
					email,
				}
			} else {
				this.Logout()
			}
			return res
		},
		Logout() {
			this.isLogin = false
			this.adminInfo = {
				id: 0,
				nickname: '',
				email: '',
			}
			this.avatar = ''
			removeToken()
			appStore.sidebarOpen = false
		},
	},
})
