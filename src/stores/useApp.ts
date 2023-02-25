const adminDialogWidthMap: Record<DeviceSize, string> = {
	xl: '30%',
	lg: '30%',
	md: '40%',
	sm: '60%',
	xs: '90%',
}

const loginMenu: MenuItem[] = [
	{ id: 0, name: '首页', path: '/' },
	{ id: 1, name: '归档', path: '/archive' },
	{ id: 2, name: '标签', path: '/tag' },
	{ id: 3, name: '分类', path: '/category' },
	{ id: 4, name: '关于', path: '/about' },
]

const unLoginMenu: MenuItem[] = [
	{ id: 0, name: '首页', path: '/' },
	{ id: 1, name: '标签', path: '/tag' },
	{ id: 2, name: '分类', path: '/category' },
	{ id: 3, name: '关于', path: '/about' },
]

export default defineStore('useApp', {
	state: (): {
		deviceSize: DeviceSize
		isTouchDevice: boolean
		sidebarOpen: boolean
	} => ({
		deviceSize: 'lg',
		isTouchDevice: false,
		sidebarOpen: false,
	}),
	getters: {
		adminDialogWidth(state) {
			return adminDialogWidthMap[state.deviceSize]
		},
		menuList() {
			return (isLogin: boolean) => (isLogin ? loginMenu : unLoginMenu)
		},
	},
	actions: {
		ToggleDeviceSize(deviceSize: DeviceSize) {
			this.deviceSize = deviceSize
		},
		ToggleSidebar(open: boolean) {
			this.sidebarOpen = open
		},
	},
})
