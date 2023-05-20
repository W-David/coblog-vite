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
			:style="{
				animationDelay: (animationDuration / bgImgs.length) * index + 's',
				animationDuration: animationDuration + 's'
			}" />
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
									Coblog
								</text>
							</svg>
						</div>
					</div>
					<el-form
						ref="formRef"
						v-model="form"
						class="login-card-content"
						label-position="right"
						:rules="rules"
						status-icon
						inline-message>
						<el-form-item prop="email">
							<el-input
								v-model="form.email"
								placeholder="邮箱"></el-input>
						</el-form-item>
						<el-form-item prop="password">
							<el-input
								v-model="form.password"
								placeholder="密码"></el-input>
						</el-form-item>
						<el-form-item
							v-show="needRegister"
							prop="rPassword">
							<el-input
								v-model="form.rPassword"
								placeholder="再次输入密码"></el-input>
						</el-form-item>
						<el-form-item
							v-show="needRegister"
							prop="nickName">
							<el-input
								v-model="form.nickName"
								placeholder="昵称"></el-input>
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
										label="保存密码"
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
									@click="handleLogin()">
									登录
								</el-button>
							</div>
							<div
								v-else
								class="register-area">
								<el-button
									type="success"
									@click="handleRegister()">
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
definePage({
	name: 'login',
	meta: {
		layout: 'login'
	}
})
const adminStore = useAdmin()
const router = useRouter()
const needRegister = ref(false)
const formRef = ref(null)
const { isDark, toggleDark } = useDarks()
const form = reactive({
	email: '',
	password: '',
	rPassword: '',
	nickName: ''
})
const rememberMe = ref(false)
watch(rememberMe, (nv, ov) => {
	if (!nv && ov) {
		localCache.remove('login-form')
		localCache.remove('remember-me')
	} else {
		localCache.set('remeber-me', 'remember-me')
		localCache.setJSON('login-form', form)
	}
})
const rules = reactive({
	email: [],
	password: [],
	rPassword: [],
	nickName: []
})

const handleLogin = async () => {
	const submitForm = {
		email: form.email,
		password: form.password
	}

	const res = await adminStore.Login(submitForm)
	if (res.data.code !== 200 || !res.data.data) return
	router.push({ path: '/' })
	ElMessage({
		type: 'success',
		message: `${res.data.data.nickname ?? res.data.data.email}, 欢迎来到Cody's Blog`
	})
}
const handleRegister = async () => {
	const submitForm = {
		email: form.email,
		password: form.password,
		rPassword: form.rPassword,
		nickname: form.nickName
	}
	const res = await adminStore.Register(submitForm)
	router.push({ path: '/' })
	ElMessage({ type: 'success', message: res.data.msg })
}
const handleSwitch = () => {
	form.email = ''
	form.password = ''
	form.rPassword = ''
	form.nickName = ''
	needRegister.value = !needRegister.value
}
const animationDuration = ref(48)
const getImageUrl = (name: string) => {
	return new URL(`../assets/image/${name}.webp`, import.meta.url).href
}
const bgImgs = reactive(['bg-01', 'bg-02', 'bg-03', 'bg-04'])
const initForm = () => {
	const rememberMeCache = !!localCache.get('remember-me') ?? false
	rememberMe.value = rememberMeCache
	if (rememberMe.value) {
		// debugger
		const formCache = localCache.getJSON('login-form')
		form.email = formCache?.email ?? ''
		form.password = formCache?.password ?? ''
		form.rPassword = formCache?.rPassword ?? ''
		form.nickName = formCache?.nickName ?? ''
	} else {
		// debugger
		form.email = ''
		form.password = ''
		form.rPassword = ''
		form.nickName = ''
	}
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
								@include svg-text-stroke-animation;
								//文本居中
								text-anchor: middle;
								dominant-baseline: middle;
								letter-spacing: 8px;
								font-size: 50px;
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
					&:deep {
						.el-form-item {
							margin-bottom: 10px;
						}
					}

					.hint-area {
						@include layout(100%, auto, 0, 0 2px);
						@include flex-box(row, space-between, center);

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

						&:deep {
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

					&:deep {
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
