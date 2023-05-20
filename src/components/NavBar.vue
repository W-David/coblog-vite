<template>
	<div class="nav-bar-container">
		<div class="nav-icon">
			<el-icon
				:size="20"
				class="hidden-md-and-up"
				@click.stop.prevent="handleExpand">
				<i-ep-expand />
			</el-icon>
			<span
				data-text="Cody's Blog"
				class="icon-text"
				@click="toHome">
				Cody's Blog
			</span>
		</div>
		<div class="nav-menu hidden-sm-and-down">
			<el-menu
				ref="menuRef"
				:default-active="activePage"
				:router="true"
				mode="horizontal"
				:ellipsis="false">
				<el-menu-item
					v-for="menu in menuList"
					:key="menu.id"
					:index="menu.path">
					{{ menu.name }}
				</el-menu-item>
			</el-menu>
		</div>
		<div class="nav-search">
			<search></search>
		</div>
		<div class="nav-right">
			<div class="nav-switch hidden-xs-only">
				<switch-dark v-model="isDark"></switch-dark>
			</div>
			<div class="nav-user-info hidden-sm-and-down">
				<admin v-if="isLogin"></admin>
				<span
					v-else
					@click="toLogin">
					<span class="to-login">登录</span>
				</span>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
const adminStore = useAdmin()
const appStore = useApp()
const router = useRouter()
const route = useRoute()
const setSidebarOpen = (open: boolean) => appStore.ToggleSidebar(open)
const menuList = computed(() => appStore.menuList(adminStore.isLogin))

const activePage = computed(() => route.name)
const menuRef = ref()

const isLogin = computed(() => adminStore.isLogin)
const { isDark } = useDarks()

const handleExpand = () => setSidebarOpen(true)
const toLogin = () => {
	router.push({ name: 'login' })
}
const toHome = () => {
	router.push({ name: '/' })
}
</script>

<style lang="scss" scoped>
.nav-bar-container {
	@include flex-box(row, space-between, center);
	@include bg-color(#f4f4f4, #050505);
	@include box-shadow(0 0 4px var(--el-border-color));
	height: $header-height;
	padding: 5px 16px;
	z-index: 5000;
	.nav-icon {
		@include flex-box(row, space-between, center);
		@include font-hei;
		.icon-text {
			@include font-fang-song;
			font-weight: bold;
			color: var(--el-color-primary);
			position: relative;
			font-size: 22px;
			word-spacing: 1.2px;
			line-height: 1.2;
			white-space: nowrap;
			user-select: none;
			cursor: pointer;
		}

		&:deep .el-icon {
			--color: var(--el-color-primary) !important;
			margin-right: 6px;
		}
	}
	.nav-menu {
		margin-left: 36px;
		&:deep {
			.el-menu {
				@include bg-color(#f4f4f4, #050505);
				border-color: transparent;
				.el-menu-item {
					padding: 0 16px;
					&.is-active {
						@include bg-color(#f4f4f4, #050505);
						color: var(--el-color-primary);
					}
					&:hover {
						@include bg-color(#f4f4f4, #050505);
						color: var(--el-color-primary);
						outline: none;
					}
				}
			}
		}
	}
	.nav-search {
		margin-left: auto;
	}

	.nav-right {
		@include flex-box(row, center, center, nowrap);
		.nav-switch {
			@include flex-box(row, center, center, nowrap);
			margin-left: 16px;
		}

		.nav-user-info {
			margin-left: 16px;
			.to-login {
				font-weight: bold;
				font-size: 16px;
				text-indent: 1px;
				letter-spacing: 1px;
				// text-shadow: 1px 1px 2px var(--el-color-primary-light-9);
				cursor: pointer;
				transition: all 300ms ease;
				&:hover {
					color: var(--el-color-primary);
				}
			}
		}
	}
}
</style>
