import { Role } from '~/graphql/generated/graphql'
import pinia from '~/modules/pinia'
const aliossStore = useAlioss(pinia)
const appStore = useApp(pinia)

export default defineStore('useAdmin', {
	state: (): {
		adminInfo?: AdminInfo
		avatar?: string
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
			if (!this.adminInfo) {
				return
			}
			const sts = aliossStore.sts
			const client = getOssClient(sts)
			const res = await client.put(this.adminInfo.email + '-avatar', file)
			if (res.res.status !== 200) {
				return
			}
			const url = res.url
			const adminId = this.adminInfo.id
			onApolloContext(() => {
				const { mutate, onDone } = useMutation(updateOneUser)
				mutate({
					data: {
						avatar: {
							set: url
						}
					},
					where: {
						id: adminId
					}
				})
				onDone(result => {
					if (result.errors) {
						return
					}
					this.avatar = url
					ElMessage({ message: '头像上传成功', type: 'success', grouping: true })
				})
			})
		},
		DeleteAvatar() {
			if (!this.adminInfo) {
				return
			}
			const adminId = this.adminInfo.id
			onApolloContext(() => {
				const { mutate, onDone } = useMutation(updateOneUser)
				mutate({
					data: {
						avatar: {
							set: ''
						}
					},
					where: {
						id: adminId
					}
				})
				onDone(async result => {
					if (result.errors) {
						return
					}
					if (!this.adminInfo) {
						return
					}
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
			})
		},
		SetAdminInfo(adminInfo: AdminInfo) {
			const { id, nickname, email } = adminInfo
			onApolloContext(() => {
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
						id
					}
				})
				onDone(result => {
					if (result.errors) {
						return
					}
					this.adminInfo = { id, nickname, email }
				})
			})
		},
		Login(params: { email: string; password: string }) {
			const router = useRouter()
			onApolloContext(() => {
				const { onResult, onError } = useQuery(graphqlLogin, {
					email: params.email,
					password: params.password
				})
				onResult(result => {
					if (result.networkStatus !== NetworkStatus.ready) {
						return
					}
					const token = result.data.login?.token
					if (!token) return
					setToken(token)
					onApolloContext(() => {
						const { onResult } = useQuery(graphqlAuth)
						onResult(result => {
							if (result.networkStatus !== NetworkStatus.ready) {
								return
							}
							const auth = result.data?.auth
							if (!auth) return
							const { id, nickName: nickname, email, avatar } = auth
							this.avatar = avatar || ''
							this.adminInfo = { id, nickname, email }
							this.isLogin = true
							appStore.sidebarOpen = false
							router.push({ path: '/' })
							ElMessage({
								type: 'success',
								message: `${this.adminInfo.nickname || this.adminInfo.email}, 欢迎来到Cody's Blog`
							})
						})
					})
				})
				onError(() => {
					this.Logout()
				})
			})
		},
		Register(params: { email: string; password: string; role: Role.Admin }) {
			const router = useRouter()
			onApolloContext(() => {
				const { mutate, onDone, onError } = useMutation(graphqlRegister)
				mutate({
					email: params.email,
					password: params.password,
					role: params.role
				})
				onDone(result => {
					if (result.errors) {
						return
					}
					const token = result.data?.register.token
					if (!token) return
					setToken(token)
					onApolloContext(() => {
						const { onResult } = useQuery(graphqlAuth)
						onResult(result => {
							if (result.networkStatus !== NetworkStatus.ready) {
								return
							}
							const auth = result.data?.auth
							if (!auth) return
							const { id, nickName: nickname, email, avatar } = auth
							this.avatar = avatar || ''
							this.adminInfo = { id, nickname, email }
							this.isLogin = true
							appStore.sidebarOpen = false
							router.push({ path: '/' })
							ElMessage({
								type: 'success',
								message: `${this.adminInfo.nickname || this.adminInfo.email}, 欢迎来到Cody's Blog`
							})
						})
					})
				})
				onError(() => {
					this.Logout()
				})
			})
		},
		GetInfo(): Promise<AdminInfo> {
			return new Promise((resolve, reject) => {
				onApolloContext(() => {
					const { onResult, onError } = useQuery(graphqlAuth)
					onResult(result => {
						if (result.networkStatus !== NetworkStatus.ready) {
							return
						}
						const auth = result.data?.auth
						if (!auth) return
						const { id, nickName: nickname, email, avatar } = auth
						this.isLogin = true
						this.avatar = avatar || ''
						this.adminInfo = { id, nickname, email }
						resolve({ ...this.adminInfo })
					})
					onError(error => {
						this.Logout()
						reject(error)
					})
				})
			})
		},
		Logout() {
			this.isLogin = false
			this.adminInfo = undefined
			this.avatar = ''
			removeToken()
			appStore.sidebarOpen = false
		}
	}
})
