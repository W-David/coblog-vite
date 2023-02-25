<template>
	<div class="blog-page">
		<div class="blog-edit-area">
			<div class="blog-img">
				<file-upload
					:is-uploaded="!!blogBanner"
					:img-url="blogBanner"
					trig-hint="上传头图"
					descrip-hint="头图"
					@on-upload="handleUpload"
					@on-delete="handleDelete"
				>
				</file-upload>
			</div>
			<div class="blog-title">
				<input v-model="blogTitle" placeholder="取个标题吧(❁´◡`❁)" />
			</div>
			<div class="blog-tc">
				<div class="tag-area">
					<select-area
						select-text="选择标签"
						add-text="添加标签"
						:items="tags"
						@on-select="handleTagSelect"
						@on-add-item="handleTagAdd"
					></select-area>
				</div>
				<div class="cate-area">
					<select-area
						styl="success"
						select-text="选择分类"
						add-text="添加分类"
						:items="cates"
						@on-select="handleCateSelect"
						@on-add-item="handleCateAdd"
					></select-area>
				</div>
			</div>
			<div class="blog-desc">
				<textarea
					v-model="blogDesc"
					placeholder="请输入文章描述(^///^)"
				></textarea>
			</div>
			<div class="blog-text">
				<md-editor
					v-model="text"
					:theme="isDark ? 'dark' : 'light'"
					:preview="false"
					preview-theme="cyanosis"
					placeholder="开始你的创作吧<(￣︶￣)↗[GO!]"
					@on-upload-img="onUploadImg"
				/>
			</div>
			<div class="blog-ctrl">
				<el-button type="success" @click="submitBlog">提交博文</el-button>
			</div>
		</div>
		<el-dialog v-model="showAll" title="请选择">
			<selected-list
				v-model:checkedArr="checkedArr"
				:loading="isListLoading"
				:is-show="showAll"
				:list="list"
			>
			</selected-list>
		</el-dialog>
	</div>
</template>

<script lang="ts" setup>
import MdEditor from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

definePage({
	name: 'blog',
	meta: {
		layout: 'blog',
		transitionName: 'fade',
	},
})

const { isDark } = useDarks()
const router = useRouter()
const route = useRoute<'blog'>()
const articleId = route.params.id ? +route.params.id : 0
const articleStore = useArticle()
const aliStore = useAlioss()
const tagStore = useTag()
const categoryStore = useCategory()

const title = reactive({
	text: '选择分类',
	type: 'cate',
})
const list = ref<Tag[] | Category[]>([])
const showAll = ref(false)
const isListLoading = ref(false)
const checkedArr = ref([])

const blogBanner = ref('')
const blogBannerId = ref('')
const blogTitle = ref('')
const blogDesc = ref('')
const tags = ref<Tag[]>([])
const cates = ref<Category[]>([])

const text = ref('')

const onUploadImg = async (
	files: File[],
	callback: (urls: Array<string>) => void
) => {
	try {
		const promises = files.map((file) => uploadImg(file))
		const urls = await Promise.all(promises)
		callback(urls ?? [])
	} catch (err) {
		console.log(err)
		callback([])
	}
}

const uploadImg = async (file: File) => {
	const client = getOssClient(aliStore.sts)
	const res = await client.put(file.name, file)
	if (res.res.status === 200) {
		ElMessage({ message: '上传成功', type: 'success' })
		const url = res.url
		return url
	} else {
		ElMessage({ message: '图片上传失败', type: 'error' })
		return ''
	}
}

const handleTagSelect = async () => {
	title.text = '选择标签'
	title.type = 'tag'
	showAll.value = true
	isListLoading.value = true
	const res = await listTag()
	isListLoading.value = false
	const inTags = (item: Tag) => tags.value.some((tag) => tag.id === item.id)
	list.value = res.data.data?.rows.filter((item) => !inTags(item)) || []
}
const handleCateSelect = async () => {
	title.text = '选择分类'
	title.type = 'cate'
	showAll.value = true
	isListLoading.value = true
	const res = await listCategory()
	isListLoading.value = false
	const inCates = (item: Category) =>
		cates.value.some((cate) => cate.id === item.id)
	list.value = res.data.data?.rows.filter((item) => !inCates(item)) || []
}
const handleTagAdd = async (tagName: string) => {
	const data = { name: tagName }
	const tag = await tagStore.CreateTag(data)
	if (tag) {
		tags.value.push(tag)
	}
}
const handleCateAdd = async (cateName: string) => {
	const data = { name: cateName }
	const cate = await categoryStore.CreateCategory(data)
	if (cate) {
		cates.value.push(cate)
	}
}
watch(showAll, (nv, ov) => {
	if (!nv && ov) {
		if (!checkedArr.value || !checkedArr.value.length) {
			return
		}
		if (title.type === 'tag') {
			tags.value.push(...checkedArr.value)
		} else if (title.type === 'cate') {
			cates.value.push(...checkedArr.value)
			// eslint-disable-next-line
		} else {
		}
	}
})

const handleUpload = async (file: File) => {
	const { name, size, type } = file
	const client = getOssClient(aliStore.sts)
	const res = await client.put(file.name, file)
	if (res.res.status === 200) {
		const url = res.url
		blogBanner.value = url
		const fileData = {
			name,
			size,
			extension: type,
			path: url,
		}
		const addRes = await addFile({ ...fileData })
		blogBannerId.value = String(addRes.data.data.id) ?? ''
		ElMessage({ message: '头图已成功上传', type: 'success' })
	} else {
		ElMessage({ message: '头图上传失败', type: 'error' })
		blogBanner.value = ''
	}
}

const handleDelete = async () => {
	const bannerId = blogBannerId.value || ''
	if (!bannerId) return
	blogBanner.value = ''
	blogBannerId.value = ''
	const deleteRes = await deleteFile(+bannerId)
	if (deleteRes.data.code !== 200) return
	ElMessage({ message: '头图已删除', type: 'success' })
}

const submitBlog = async () => {
	const title = blogTitle.value
	const content = text.value
	const categoryIds = cates.value.map((cate) => cate.id)
	const tagIds = tags.value.map((tag) => tag.id)
	const description = blogDesc.value || '默认描述内容'
	const bannerId = blogBannerId.value || ''
	const blog = {
		title,
		content,
		description,
		bannerId,
		categoryIds,
		tagIds,
	}
	const res = articleId
		? await updateArticle({ ...blog, id: articleId })
		: await createArticle(blog)
	if (res.data.code === 200 && res.data.data) {
		const article = res.data.data
		articleStore.articleMap.set(article.id, article)
		router.push({ path: '/' })
		ElMessage({ message: `已保存 • ${title}`, type: 'success' })
	}
}

const initPage = () => {
	if (articleId) {
		const article = computed(() => articleStore.getArticleById(articleId))
		if (article.value) {
			const {
				title,
				content,
				banner,
				description,
				categories,
				tags: tgs,
			} = article.value
			blogTitle.value = title
			blogBannerId.value = banner?.id.toString() ?? ''
			blogBanner.value = banner?.path ?? ''
			blogDesc.value = description
			cates.value = categories ?? []
			tags.value = tgs ?? []
			text.value = content ?? ''
		}
	}
}
initPage()
</script>

<style lang="scss" scoped>
.blog-page {
	@include layout(100%, auto, 0 0 $main-margin 0, 0);
	z-index: 1000;

	.blog-edit-area {
		@include layout(auto, auto, 0, $main-margin);
		@include border(none);
		@include box-shadow(
			8px 8px 20px rgba(0, 0, 0, 0.05),
			-4px -4px 20px rgba(0, 0, 0, 0.05)
		);
		@include bg-color(#fff, #1a1a1a);
		.blog-img {
			@include layout(100%, 300px, 0 0 8px 0, 0);
			background-color: var(--el-bg-color);
			border-radius: 8px;
		}
		.blog-title {
			@include layout(100%, auto, 0 0 8px 0, 0);
			min-height: 48px;
			input {
				@include layout(100%, auto, 0, 12px);
				font-size: 24px;
				font-weight: bold;
				outline: none !important;
				background-color: var(--el-bg-color);
				@include border(1px solid var(--el-border-color), 4px);
				@include font-hei;
			}
		}
		.blog-toolbar {
			&:deep .w-e-toolbar {
				background-color: var(--el-bg-color);
				@include border(1px solid var(--el-border-color), 4px);
				@include layout(100%, auto, 8px 0, 0);
			}
		}
		.blog-tc {
			@include layout(100%, auto, 8px 0, 6px);
			@include border(1px solid var(--el-border-color), 4px);
			background-color: var(--el-bg-color);
			.tag-area {
				@include layout(100%, auto, 0, 0);
			}
			.cate-area {
				@include layout(100%, auto, 0, 0);
			}
		}
		.blog-desc {
			@include layout(100%, auto, 8px 0, 0);
			textarea {
				width: 100%;
				height: 120px;
				margin: 0;
				padding: 12px;
				resize: none;
				border: none;
				outline: none;
				font-size: 20px;
				font-weight: 550;
				@include border(1px solid var(--el-border-color), 4px);
				@include font-hei;
				background-color: var(--el-bg-color);
			}
		}
		.blog-text {
			@include layout(100%, auto, 8px 0, 0);
			.md-editor {
				background-color: var(--el-bg-color);
			}
		}
		.blog-ctrl {
			&:deep {
				.el-button {
					@include layout(100%, auto, 8px 0 0 0, auto);
					border-radius: 16px;
				}
			}
		}
	}
	.blog-view-area {
		@include layout(100%, 100%, 0, 16px);
		@include border(1px solid var(--el-border-color));
	}
}
</style>
