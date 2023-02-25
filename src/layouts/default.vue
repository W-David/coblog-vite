<template>
	<div class="app-container">
		<header class="header-container">
			<nav-bar></nav-bar>
			<side-bar></side-bar>
		</header>
		<div class="content-container">
			<section class="main-container">
				<slot></slot>
			</section>
			<footer class="footer-container">
				<h-footer></h-footer>
			</footer>
		</div>
	</div>
</template>
<script lang="ts" setup>
useDevice()
useWindowResize()
</script>

<style lang="scss" scoped>
.app-container {
	@include layout(auto, 100%);

	.header-container {
		@include position(fixed, 0, 0, 0);
		width: 100%;
		z-index: 1005;
	}

	.content-container {
		@include flex-box(column);
		@include layout;

		.main-container {
			position: relative;
			margin-top: $header-height;
		}

		.footer-container {
			margin-top: auto;
		}
	}
}
</style>
