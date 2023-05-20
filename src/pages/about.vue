<template>
	<div class="about-page">
		<div class="about-card">
			<div class="hint-line">
				<i-custom-website class="info-svg" />
				<span class="info-label">前端</span>
				<span class="info-text">Vue3 + ElementPlus + Webpack</span>
			</div>
			<div class="hint-line">
				<i-custom-server class="info-svg" />
				<span class="info-label">后端</span>
				<span class="info-text">Nodejs + Koa2 + Sequelize</span>
			</div>
			<div class="hint-line">
				<i-custom-github class="info-svg" />
				<span class="info-label">开源</span>
				<a
					style="color: var(--el-color-warning)"
					href="https://github.com/W-David/coblog-frontend">
					Frontend
				</a>
				<el-divider direction="vertical" />
				<a
					style="color: var(--el-color-warning)"
					href="https://github.com/W-David/coblog">
					Backend
				</a>
			</div>
			<div class="hint-line contact-me-email">
				<i-custom-email class="info-svg" />
				<span class="info-label">邮箱</span>
				<span class="info-text">1776867536@qq.com</span>
			</div>
			<!-- <div class="hint-line contact-me-call">
        <span class="info-label">电话</span>
        <span class="info-text">18406583710</span>
      </div> -->
			<div class="hint-line contact-me-profile">
				<i-custom-home class="info-svg" />
				<span class="info-label">个人主页</span>
				<a
					style="color: var(--el-text-color-regular)"
					href="https://github.com/W-David">
					Github
				</a>
				<el-divider direction="vertical" />
				<a
					style="color: #fc8bab"
					href="https://space.bilibili.com/36009071">
					B站
				</a>
				<el-divider direction="vertical" />
				<a
					style="color: #d32d31"
					href="https://music.163.com/#/user/home?id=318980527">
					网易云
				</a>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
definePage({
	name: 'about',
	meta: {
		transitionName: 'fade'
	}
})
</script>

<style lang="scss" scoped>
.about-page {
	@include layout(100%, auto, 0 0 $main-margin 0, 0);
	z-index: 1000;
	.about-card {
		@include layout(100%, auto, 0 0 $main-margin 0, 20px);
		@include flex-box(row, space-around, center, wrap);
		@include border(none, 8px);
		@include font-hei;
		@include transition(all 200ms ease-out);
		@include bg-color(#fcfcfc);
		box-shadow: var(--el-box-shadow);
		// font-weight: bolder;
		text-align: start;
		line-height: 1.8;
		&:hover {
			@include box-shadow;
		}
		.hint-line {
			flex: auto;
			@include layout(auto, auto, 8px, 2px 12px);
			@include border(4px solid var(--el-color-primary), 8px, left);
			background-color: var(--el-color-primary-light-9);
			color: var(--el-color-primary);
			.info-svg {
			}
			.info-label {
				margin-left: 4px;
				margin-right: 8px;
				display: inline-block;
			}
			.info-text {
				color: var(--el-text-color-regular);
				cursor: pointer;
				font-size: 14px;
				&:hover {
					color: var(--el-text-color-primary);
				}
			}
			a {
				font-size: 14px;
			}
		}
	}
}
</style>
