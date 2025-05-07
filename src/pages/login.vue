<template>
	<div class="login-page">
		<!-- <div
      class="bg-fade"
      v-for="(bgImg, index) in bgImgs"
      :key="index"
      :style="{
        backgroundImage: 'url(' + bgImg + ')',
        animationDelay: (animationDuration / bgImgs.length) * index + 's',
        animationDuration: animationDuration + 's'
      }"
    ></div> -->
		<img
			v-for="(imgUrl, index) in bgImgs"
			:key="index"
			v-LazyLoad="getImageUrl(imgUrl)"
			class="bg-fade"
			alt="noImg"
			:style="getBgImgsStyle(index)" />
		<div
			class="bult-btn"
			@click="toggleDark()">
			<i-custom-sunny v-if="isDark" />
			<i-custom-moon v-else />
		</div>
		<div
			class="no-auth-btn"
			@click="router.push({ path: '/' })">
			<span>游客登入</span>
		</div>
		<el-row
			justify="center"
			class="login-row-container">
			<el-col
				class="login-col-container"
				:xs="22"
				:sm="12"
				:md="8"
				:lg="6"
				:xl="6">
				<div class="login-card">
					<div class="login-card-header">
						<!-- <span :class="[needRegister ? 'regis-header-hint' : 'login-header-hint']">欢迎来到Coody's Blog</span> -->
						<div
							class="svg-header-text"
							:class="[needRegister ? 'regis-header-hint' : 'login-header-hint']">
							<svg>
								<text
									x="100"
									y="60">
									{{ logoText }}
								</text>
							</svg>
						</div>
					</div>
					<el-form
						ref="formRef"
						:model="form"
						class="login-card-content"
						label-position="right"
						:rules="rules"
						:status-icon="false"
						:show-message="true"
						:inline-message="true">
						<el-form-item
							prop="email"
							required>
							<el-input
								ref="emailInput"
								v-model="form.email"
								placeholder="邮箱"
								@keyup.enter="nextFocus(formRef, passwordInput, 'email')"></el-input>
						</el-form-item>
						<el-form-item
							prop="password"
							required>
							<el-input
								ref="passwordInput"
								v-model="form.password"
								show-password
								placeholder="密码"
								@keyup.enter="needRegister ? nextFocus(formRef, rPasswordInput, 'password') : handleLogin(formRef)"></el-input>
						</el-form-item>
						<el-form-item
							v-if="needRegister"
							required
							prop="rPassword">
							<el-input
								ref="rPasswordInput"
								v-model="form.rPassword"
								show-password
								placeholder="再次输入密码"
								@keyup.enter="needRegister && nextFocus(formRef, nickNameInput, 'rPassword')"></el-input>
						</el-form-item>
						<el-form-item
							v-if="needRegister"
							required
							prop="nickName">
							<el-input
								ref="nickNameInput"
								v-model="form.nickName"
								placeholder="昵称"
								@keyup.enter="needRegister && handleRegister(formRef)"></el-input>
						</el-form-item>
						<el-form-item>
							<div class="hint-area">
								<div
									class="register-hint"
									:class="[needRegister ? 'regis-hint' : 'login-hint']"
									@click="handleSwitch">
									{{ !needRegister ? '还没有账号？注册一个吧' : '已有账号，去登陆' }}
								</div>
								<div class="remember-hint">
									<el-checkbox
										v-model="rememberMe"
										label="自动填充"
										size="small"
										border />
								</div>
							</div>
						</el-form-item>
						<el-form-item>
							<div
								v-if="!needRegister"
								class="login-area">
								<el-button
									type="primary"
									@click="handleLogin(formRef)">
									登录
								</el-button>
							</div>
							<div
								v-else
								class="register-area">
								<el-button
									type="success"
									@click="handleRegister(formRef)">
									注册
								</el-button>
							</div>
						</el-form-item>
					</el-form>
				</div>
			</el-col>
		</el-row>
		<div class="footer-container">
			<h-footer />
		</div>
	</div>
</template>

<script lang="ts" setup>
import { FormInstance, FormRules, InputInstance } from 'element-plus'
import { Role } from '~/graphql/generated/graphql'

definePage({
	name: 'login',
	meta: {
		layout: 'login'
	}
})
const animationDuration = ref(48)
const bgImgs = reactive(['bg-01', 'bg-02', 'bg-03', 'bg-04'])
const adminStore = useAdmin()
const router = useRouter()
const needRegister = ref(false)
const formRef = ref<FormInstance>()
const { isDark, toggleDark } = useDarks()

const emailInput = ref<InputInstance>()
const passwordInput = ref<InputInstance>()
const rPasswordInput = ref<InputInstance>()
const nickNameInput = ref<InputInstance>()

const getBgImgsStyle = (index: number) => ({
	animationDelay: (animationDuration.value / bgImgs.length) * index + 's',
	animationDuration: animationDuration.value + 's'
})

const form = reactive({
	email: 'admin@root.com',
	password: 'admin',
	rPassword: '',
	nickName: ''
})
const rememberMe = ref(false)
const REMEMBER_KEY = 'remember-me'
const REMEMBER_FORM_KEY = 'login-form'
const logoText = ref('Coblog')

watch(rememberMe, val => {
	if (!val) {
		localCache.remove(REMEMBER_FORM_KEY)
		localCache.remove(REMEMBER_KEY)
	} else {
		formRef.value?.validate(valid => {
			if (valid) {
				localCache.set(REMEMBER_KEY, 'is_remembered')
				localCache.setJSON(REMEMBER_FORM_KEY, form)
			} else {
				localCache.remove(REMEMBER_KEY)
				localCache.remove(REMEMBER_FORM_KEY)
			}
		})
	}
})
const rules = reactive<FormRules<typeof form>>({
	email: [
		{ required: true, message: '请输入邮箱地址', trigger: 'blur' },
		{
			pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
			message: '请输入正确的邮箱格式',
			trigger: 'blur'
		}
	],
	password: [
		{ required: true, message: '请输入密码', trigger: 'blur' },
		{
			min: 4,
			message: '密码长度不能少于4个字符',
			trigger: 'blur'
		}
	],
	rPassword: [
		{ required: true, message: '请再次输入密码', trigger: 'blur' },
		{
			validator: (rule, value, callback) => {
				if (value !== form.password) {
					callback(new Error('两次输入密码不一致'))
				} else {
					callback()
				}
			},
			trigger: 'blur'
		}
	],
	nickName: [
		{ required: true, message: '请输入昵称', trigger: 'blur' },
		{ min: 2, max: 20, message: '昵称长度在2到20个字符之间', trigger: 'blur' }
	]
})

const handleLogin = (formRef: FormInstance) => {
	formRef.validate(valid => {
		if (valid) {
			adminStore.Login(
				{
					email: form.email,
					password: form.password
				},
				() => {
					router.push({ path: '/' })
				}
			)
		}
	})
}
const handleRegister = (formRef: FormInstance) => {
	formRef.validate(valid => {
		if (valid) {
			adminStore.Register(
				{
					email: form.email,
					password: form.password,
					role: Role.Admin
				},
				() => {
					router.push({ path: '/' })
				}
			)
		}
	})
}
const handleSwitch = () => {
	needRegister.value = !needRegister.value
	form.email = ''
	form.password = ''
	form.rPassword = ''
	form.nickName = ''
	formRef.value?.clearValidate()
}

const getImageUrl = (name: string) => {
	return new URL(`../assets/image/${name}.webp`, import.meta.url).href
}

const nextFocus = (formRef: FormInstance, nextInput: InputInstance, propName: string) => {
	formRef.validateField(propName, valid => {
		if (valid) {
			nextInput.focus()
		}
	})
}

const initForm = () => {
	const isRemembered = !!localCache.get(REMEMBER_KEY) || false
	const formCache = localCache.getJSON(REMEMBER_FORM_KEY)
	if (isRemembered && formCache) {
		rememberMe.value = true
		form.email = formCache.email
		form.password = formCache.password
	} else {
		rememberMe.value = false
		form.email = ''
		form.password = ''
		// 没有缓存的数据，表单自动聚焦
		emailInput.value?.focus()
	}
	onMounted(() => {
		initForm()
	})
}
initForm()
</script>

<style lang="scss" scoped>
@import url('../styles/web_font/google.css');

.login-page {
	@include layout(100vw, 100vh, 0, 0);
	position: absolute;
	top: 0;
	left: 0;
	overflow: hidden;
	// background: linear-gradient(30deg, #ffcc00, deeppink, #9c27b0);
	// @include hue-rotate;

	.bg-fade {
		opacity: 0;
		@include img-cover;
		@include bg-fade-animation;
	}

	.bult-btn {
		@include layout(42px, 42px, 0, 0);
		@include flex-box(row, center, center);
		@include border(none, 8px);
		@include box-shadow;
		color: var(--el-text-color-secondary);
		background-color: var(--el-bg-color);
		position: fixed;
		top: $main-margin;
		right: $main-margin;
		z-index: 1000;
		cursor: pointer;
		font-size: 32px;
		transition: all 320ms ease;
		&:hover {
			transform: scale(1.12);
			color: #fff;
			background-color: var(--el-color-primary);
		}
	}

	.no-auth-btn {
		@include layout(auto, 42px, 0, 0 $main-margin);
		@include flex-box(row, center, center);
		@include border(none, 8px);
		@include box-shadow;
		color: var(--el-text-color-secondary);
		background-color: var(--el-bg-color);
		position: fixed;
		top: $main-margin;
		right: 76px;
		z-index: 1000;
		cursor: pointer;
		font-size: 17px;
		// letter-spacing: 2px;
		// text-indent: 2px;
		font-weight: bold;
		transition: all 320ms ease;
		&:hover {
			transform: scale(1.12);
			color: #fff;
			background-color: var(--el-color-primary);
		}
	}

	.login-row-container {
		height: 100%;

		.login-col-container {
			@include layout(100%, auto, 0, 24vh 0 0 0);

			.login-card {
				@include layout(80%, auto, 0 auto, 12px);
				@include border(1px solid #ececec, 8px);
				@include bg-color(#fff, #1d1d1d);

				.login-card-header {
					@include layout(100%, 120px, 0 0 $main-margin 0, 4px);
					@include flex-box(row, center, center);
					@include border(null, 4px);
					@include box-shadow(2px 2px 4px #ececec, -1px -1px 2px #ececec);
					// @include font-hei;
					// color: var(--el-text-regular);
					// font-size: 20px;
					font-family: 'Bangers', cursive;
					font-weight: bold;

					.svg-header-text {
						svg {
							@include layout(200px, 100px, 0, 0);
							text {
								//文本居中
								text-anchor: middle;
								dominant-baseline: middle;
								letter-spacing: 8px;
								font-size: 50px;
								@include svg-text-stroke-animation;
							}
						}
					}

					.login-header-hint {
						color: var(--el-color-primary);
					}

					.regis-header-hint {
						color: var(--el-color-success);
					}
				}

				.login-card-content {
					&:deep() {
						.el-form-item {
							margin-bottom: 10px;
						}
					}

					.hint-area {
						@include layout(100%, auto, 0, 0 2px);
						@include flex-box(row, space-between, center);
						font-size: 12px;

						.register-hint {
							user-select: none !important;
							@include pointer;
						}

						.remember-hint {
						}
					}

					.register-area,
					.login-area {
						width: 100%;

						&:deep() {
							.el-button {
								margin: 0;
								width: 100%;
								text-indent: 4px;
								letter-spacing: 4px;
							}

							.el-button:last-child {
								margin-top: 10px;
							}
						}
					}

					.login-hint {
						&:hover {
							color: var(--el-color-primary);
						}
					}

					.regis-hint {
						&:hover {
							color: var(--el-color-success);
						}
					}

					&:deep() {
						.el-form-item:last-child {
							margin-bottom: 0;
						}
					}
				}
			}
		}
	}
	.footer-container {
		@include layout(100%, auto, 0, 0);
		@include position(absolute, 0, auto, auto, 0);
		z-index: 10;
		// position: absolute;
		// bottom: 0;
		// left: 0;
		// z-index: 10;
	}
}
</style>
