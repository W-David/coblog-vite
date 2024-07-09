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
			email: ''
		},
		avatar: '',
		isLogin: false
	}),
	getters: {},
	actions: {
		async SetAvatar(file: File) {
			const sts = aliossStore.sts
			const client = getOssClient(sts)
			const res = await client.put(this.adminInfo.email + '-avatar', file)
			if (res.res.status !== 200) {
				return
			}
			const url = res.url
			const { mutate, onDone } = useMutation(updateOneUser)
			mutate({
				data: {
					avatar: {
						set: url
					}
				},
				where: {
					id: this.adminInfo.id
				}
			})
			onDone(() => {
				this.avatar = url
				ElMessage({ message: '头像上传成功', type: 'success', grouping: true })
			})
		},
		DeleteAvatar() {
			const { mutate, onDone } = useMutation(updateOneUser)
			mutate({
				data: {
					avatar: {
						set: ''
					}
				},
				where: {
					id: this.adminInfo.id
				}
			})
			onDone(async () => {
				const sts = aliossStore.sts
				const client = getOssClient(sts)
				try {
					await client.delete(this.adminInfo.email + '-avatar')
					this.avatar = ''
					ElMessage({ message: '已删除', type: 'success', grouping: true })
				} catch (error) {
					console.error(error)
					ElMessage({ message: '删除失败', type: 'error', grouping: true })
				}
			})
		},
		SetAdminInfo(adminInfo: AdminInfo) {
			const { id, nickname, email } = adminInfo
			const { mutate, onDone } = useMutation(updateOneUser)
			mutate({
				data: {
					nickName: {
						set: nickname
					},
					email: {
						set: email
					}
				},
				where: {
					id: adminInfo.id
				}
			})
			onDone(() => {
				this.adminInfo = { id, nickname, email }
			})
		},
		async Login(params: { email: string; password: string }) {
			const res = await login(params)
			if (res.data.code === 200 && res.data.data) {
				const admin = res.data.data
				const { id, nickname, email, token, avatar } = admin
				this.isLogin = true
				this.avatar = avatar || ''
				this.adminInfo = {
					id,
					nickname,
					email
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
					email
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
					email
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
				email: ''
			}
			this.avatar = ''
			removeToken()
			appStore.sidebarOpen = false
		}
	}
})
