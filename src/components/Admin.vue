<template>
	<div class="admin-container">
		<el-avatar
			:size="36"
			shape="circle"
			:src="`${avatar}?x-oss-process=image/resize,m_fill,h_36,w_36`"
			fit="cover"
			@click.stop="tapAvatar"
		>
			<span>{{ adminInfo.nickname.substr(0, 1) }}</span>
		</el-avatar>
		<el-dropdown class="hidden-sm-and-down">
			<span class="dropdown-link">
				Hello, {{ adminInfo.nickname }}
				<el-icon class="el-icon--right">
					<i-ep-arrow-down />
				</el-icon>
			</span>
			<template #dropdown>
				<el-dropdown-menu>
					<el-dropdown-item>
						<span @click="toAdminInfo">个人信息</span>
					</el-dropdown-item>
					<el-dropdown-item>
						<span @click="toBlog">写个博文</span>
					</el-dropdown-item>
					<el-dropdown-item>
						<span @click="logout">退出登录</span>
					</el-dropdown-item>
				</el-dropdown-menu>
			</template>
		</el-dropdown>
	</div>
	<teleport to="#rootAdminInfo">
		<el-dialog
			v-model="openAdminInfo"
			center
			:show-close="false"
			:width="dialogWidth"
		>
			<div class="avatar-container">
				<file-upload
					:is-uploaded="!!avatar"
					:img-url="avatar"
					trig-hint="上传头像"
					descrip-hint="头像"
					@on-upload="handleUpload"
					@on-delete="handleDelete"
				>
				</file-upload>
			</div>
			<div class="info-container">
				<div class="info-name">
					<span class="info-hint">昵称 - </span>
					<span v-if="!isEN" class="info-content" @click="isEN = true">
						{{ adminForm.nickname || '暂无昵称' }}
					</span>
					<input v-else v-model="adminForm.nickname" @blur="isEN = false" />
				</div>
				<div class="info-email">
					<span class="info-hint">邮箱 - </span>
					<span v-if="!isEE" class="info-content" @click="isEE = true">
						{{ adminForm.email }}
					</span>
					<input v-else v-model="adminForm.email" @blur="isEE = false" />
				</div>
			</div>
			<template #header>
				<span class="admin-info-title">个人信息</span>
			</template>
			<template #footer>
				<div class="admin-info-footer">
					<el-button type="primary" plain @click="handleCancel">取消</el-button>
					<el-button type="primary" @click="handleUpdate">修改</el-button>
				</div>
			</template>
		</el-dialog>
	</teleport>
</template>

<script lang="ts" setup>
useDOMCreate('rootAdminInfo')
const router = useRouter()
const adminStore = useAdmin()
const appStore = useApp()
const avatar = computed(() => adminStore.avatar)
const adminInfo = computed(() => adminStore.adminInfo)
const adminForm = reactive({
	nickname: adminInfo.value.nickname,
	email: adminInfo.value.email,
})
const deviceSize = computed(() => appStore.deviceSize)
const dialogWidth = computed(() => appStore.adminDialogWidth)
const openAdminInfo = ref(false)
const isEN = ref(false)
const isEE = ref(false)

const toBlog = () => {
	router.push({ name: 'blog' })
}
const toAdminInfo = () => {
	openAdminInfo.value = true
}
const tapAvatar = () => {
	const isSM = deviceSize.value === 'xs' || deviceSize.value === 'sm'
	if (!isSM) return
	appStore.ToggleSidebar(false)
	openAdminInfo.value = true
}
const logout = async () => {
	await adminStore.Logout()
	router.push({ name: 'login' })
}
const handleCancel = () => {
	openAdminInfo.value = false
}
const handleUpdate = async () => {
	const isSuccess = await adminStore.SetAdminInfo(adminInfo.value)
	openAdminInfo.value = false
	ElMessage({
		message: isSuccess ? '更新成功' : '更新失败',
		type: isSuccess ? 'success' : 'error',
		grouping: true,
	})
}
const handleUpload = async (file: File) => {
	const isSuccess = await adminStore.SetAvatar(file)
	ElMessage({
		message: isSuccess ? '头像上传成功' : '上传失败',
		type: isSuccess ? 'success' : 'error',
		grouping: true,
	})
}
const handleDelete = async () => {
	const isSuccess = await adminStore.DeleteAvatar()
	ElMessage({
		message: isSuccess ? '已删除' : '删除失败',
		type: isSuccess ? 'success' : 'error',
		grouping: true,
	})
}
</script>

<style lang="scss" scoped>
.admin-container {
	@include flex-box(row, center, center);

	:deep .el-dropdown {
		margin-left: 8px;
		.dropdown-link {
			cursor: pointer;
		}
	}
}
.avatar-container {
	@include layout(100%, 220px, 0, 0);
}
.info-container {
	.info-name,
	.info-email {
		@include layout(100%, auto, 12px 0, 12px);
		@include box-shadow(
			inset 2px 2px 4px var(--el-color-info-light-7),
			inset -1px -1px 2px var(--el-color-info-light-7)
		);
		html.dark & {
			@include box-shadow(
				inset 2px 2px 4px rgba(0, 0, 0, 0.2),
				inset -1px -1px 2px rgba(0, 0, 0, 0.2)
			);
		}

		@include border(1px solid transparent, 8px);
		@include pointer;
		.info-hint {
			font-weight: bold;
			color: var(--el-color-primary);
		}
		.info-content {
			color: var(--el-text-color-secondary);
			&:hover {
				color: var(--el-text-color-primary);
			}
			html.dark & {
				color: #dedede;
				&:hover {
					color: #eee;
				}
			}
		}
		input {
			font-size: 15px;
			margin: 0;
			padding: 0;
			border: none !important;
			outline: none !important;
			html.dark & {
				background-color: #141414;
			}
		}
	}
}
.admin-info-title {
	color: var(--el-color-primary);
	font-size: 18px;
	font-weight: bold;
}
.admin-info-footer {
	@include layout(100%, auto, 0, 0);
	@include flex-box(row, space-between, center);
}
</style>
