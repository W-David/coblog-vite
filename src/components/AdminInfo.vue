<template>
	<div class="admin-info-container">
		<div class="admin-info-title">
			<i-custom-website class="admin-info-icon" />
			<span class="admin-info-text">作者</span>
		</div>
		<div class="admin-info-content"></div>
	</div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.admin-info-container {
	@include layout(100%, auto, 0, 4px);
	@include border(none, 8px);
	@include bg-color(#fff);
	box-shadow: var(--el-box-shadow);
	.admin-info-title {
		@include layout(auto, auto, 4px, 4px);
		font-size: 16px;
		font-weight: bold;
		.admin-info-icon {
			color: var(--el-color-success);
		}
		.admin-info-text {
			margin-left: 4px;
		}
	}
	.admin-info-content {
		@include layout(100%, auto, 0, 16px);
	}
}
</style>
