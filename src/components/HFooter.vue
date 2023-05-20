<template>
	<div class="h-footer-container">
		<div class="beian-hint">
			<el-link
				href="https://beian.miit.gov.cn"
				target="_blank">
				晋ICP备2023000379号-1
			</el-link>
			<el-divider direction="vertical" />
			<el-link
				href="https://coblog.fun"
				target="_blank">
				Cody's Blog
			</el-link>
			<el-divider direction="vertical" />
			<el-popover
				placement="top-start"
				title="联系方式"
				:width="300"
				trigger="hover">
				<template #default>
					<div class="contact-me-email">邮箱: 1776867536@qq.com</div>
					<div class="contact-me-call">电话: 18406583710</div>
				</template>
				<template #reference>
					<span class="contact-me">关于我</span>
				</template>
			</el-popover>
		</div>
		<div class="copyright-hint">
			<span>Copyright © 2022 Cody. All rights reserved.</span>
			<span id="busuanzi_container_site_uv">
				累计访客数
				<span id="busuanzi_value_site_uv"></span>
				人次
			</span>
		</div>
	</div>
</template>

<script setup></script>

<style lang="scss" scoped>
.h-footer-container {
	@include layout(100%, $footer-height, 0, 0);
	@include flex-box(column, center, center);
	position: relative;
	// box-shadow: var(--el-box-shadow);
	// background-color: var(--el-bg-color);

	// &::before {
	//   content: '';
	//   position: absolute;
	//   top: 0;
	//   left: 0;
	//   width: 100%;
	//   height: $footer-height;
	//   background-color: #00000030;
	//   filter: blur(4px);
	//   z-index: -1;
	// }

	.beian-hint {
		@include flex-box(row, center, center);
		@include font-hei;
		margin-bottom: 6px;
		font-size: 12px;
		&:deep {
			.el-link {
				font-size: 12px;
			}
		}
		.contact-me {
			color: var(--el-text-color-primary);
			cursor: pointer;
		}
	}
	.copyright-hint {
		@include flex-box(row, center, center);
		@include font-hei;
		color: var(--el-text-color-regular);
		font-size: 12px;
		user-select: none;
		span {
			color: var(--el-text-color-primary);
		}
	}
}
</style>
