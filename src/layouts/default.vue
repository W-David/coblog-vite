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
const categoryStore = useCategory()
const tagStore = useTag()
const articleStore = useArticle()

const init = () => {
	articleStore.GetArticlesRecent({ take: 5 })
	articleStore.GetArticlesHot({ take: 8 })

	// 加载分类列表[无关联文章数据]
	categoryStore.checkedCateIds.splice(0, categoryStore.checkedCateIds.length)
	categoryStore.GetCategories({ take: 12, cursor: undefined })

	// 加载标签列表[无关联文章数据]
	tagStore.checkedTagIds.splice(0, tagStore.checkedTagIds.length)
	tagStore.GetTags({ take: 12, cursor: undefined })
}

init()
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
