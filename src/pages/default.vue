<script setup lang="ts">
definePage({
	name: 'default',
})
const { isDark, toggleDark } = useDarks()
const { t, toggleLocale, language } = useLanguage()

const theme = computed(() => (isDark.value ? 'dark' : 'light'))
const articleStore = useArticle()
const articles = computed(() => articleStore.getArticleList())
const getArticles = () => articleStore.GetArticles({ pageNum: 1, pageSize: 1 })
const clearArticles = () => articleStore.articleMap.clear()
onMounted(() => {
	window.particlesJS.load('particles-js', 'static/config/particles.json')
})
</script>

<template>
	<div class="m-6">Hello，This is coblog</div>
	<div class="cursor-pointer m-6" @click="toggleDark()">theme: {{ theme }}</div>
	<div class="cursor-pointer ml-6">
		<el-button type="success" @click="getArticles">获取文章</el-button>
		<el-button type="danger" @click="clearArticles">清空文章</el-button>
	</div>
	<!-- <div class="cursor-pointer ml-6">deviceSize: {{ deviceSize }}</div>
	<div class="cursor-pointer ml-6">articles: {{ articles }}</div> -->
	<div class="cursor-pointer mt-6 ml-6" @click="toggleLocale()">
		<i-custom-moon />
		<i-custom-sunny />
		<i-custom-empty />
		<i-custom-article />
		<i-custom-fire />
		<i-custom-link />
		<i-custom-tag />
		<i-custom-category />
		<div>language: {{ language }}</div>
		<div>base: {{ t('about') }}</div>
		<div>nesting: {{ t('nesting.sir') }} {{ t('nesting.lady') }}</div>
	</div>
	<div
		v-if="articles && articles.length"
		class="w-1/2 mx-auto my-6 flex justify-center items-center"
	>
		<article-card class="flex-auto w-1/2" :article="articles[0]"></article-card>
	</div>
</template>
