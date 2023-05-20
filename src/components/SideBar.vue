<template>
	<div class="drawer-container hidden-md-and-up">
		<el-drawer
			class="side-drawer"
			:model-value="sidebarOpen"
			:with-header="false"
			direction="ltr"
			append-to-body
			:z-index="10000"
			@close="onCloseDrawer">
			<div class="collapse-top">
				<el-icon
					class="drawer-icon"
					:size="20"
					@click.stop.prevent="handleCollapse">
					<i-ep-fold />
				</el-icon>
				<div class="drawer-user-info">
					<admin v-if="isLogin"></admin>
					<span
						v-else
						@click="toLogin">
						<span class="to-login">登录</span>
					</span>
				</div>
				<el-menu
					class="drawer-menu"
					:default-active="activePage"
					:router="true"
					mode="vertical"
					@select="handleChange">
					<el-menu-item
						v-if="isLogin"
						class="hidden-md-and-up"
						index="/blog">
						博文
					</el-menu-item>
					<el-menu-item
						v-for="menu in menuList"
						:key="menu.id"
						:index="menu.path">
						{{ menu.name }}
					</el-menu-item>
				</el-menu>
			</div>
			<div class="collapse-bottom">
				<el-button
					v-if="isLogin"
					class="drawer-logout"
					type="warning"
					plain
					@click="logout">
					退出登录
				</el-button>
				<switch-dark
					v-model="isDark"
					class="drawer-switch hidden-sm-and-up"></switch-dark>
			</div>
		</el-drawer>
	</div>
</template>

<script lang="ts" setup>
const adminStore = useAdmin()
const appStore = useApp()
const router = useRouter()
const route = useRoute()
const sidebarOpen = computed(() => appStore.sidebarOpen)
const setSidebarOpen = (open: boolean) => appStore.ToggleSidebar(open)
const menuList = computed(() => appStore.menuList(adminStore.isLogin))

const activePage = computed(() => route.name)

const isLogin = computed(() => adminStore.isLogin)
const isDark = useDark()

const handleChange = () => setSidebarOpen(false)
const handleCollapse = () => setSidebarOpen(false)
const onCloseDrawer = () => setSidebarOpen(false)

const logout = async () => {
	setSidebarOpen(false)
	adminStore.Logout()
	router.push({ name: 'login' })
}
const toLogin = () => {
	router.push({ name: 'login' })
}
</script>
