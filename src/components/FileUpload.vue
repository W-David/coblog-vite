<template>
	<div class="file-uploader-container">
		<el-upload
			v-show="!isUploaded"
			ref="uploadRef"
			class="file-uploader"
			action="#"
			:multiple="false"
			:limit="1"
			:show-file-list="false"
			:before-upload="beforeFileUpload">
			<template #default>
				<div
					id="trigger"
					class="trigger-area">
					<el-icon :size="18"><i-ep-plus /></el-icon>
					<span>{{ trigHint }}</span>
				</div>
			</template>
		</el-upload>
		<transition name="fade">
			<div
				v-if="isUploaded"
				class="file-img-container">
				<img
					class="file-img"
					:src="`${imgUrl}?x-oss-process=image/resize,p_25`"
					alt="noImg"
					width="100%"
					height="100%" />
				<div class="file-cover">
					<!-- <span class="file-ctrl" @click="handleView">
						<el-icon><i-ep-view /></el-icon>
						<span> 查看大图</span>
					</span> -->
					<span
						class="file-ctrl"
						@click="handleUpload">
						<el-icon><i-ep-upload /></el-icon>
						<span>重新上传</span>
					</span>
					<el-popconfirm
						confirm-button-text="是的"
						cancel-button-text="按错了"
						icon-color="red"
						title="确定删除?"
						@confirm="handleDelete">
						<template #reference>
							<span class="file-ctrl">
								<el-icon><i-ep-delete /></el-icon>
								<span>删除{{ descripHint }}</span>
							</span>
						</template>
					</el-popconfirm>
				</div>
			</div>
		</transition>
	</div>
	<!-- <el-dialog v-model="isShow" title="详情">
		<img :src="imgUrl" alt="noImg" style="width: 100%; border-radius: 4px" />
	</el-dialog> -->
</template>

<script lang="ts" setup>
const props = withDefaults(
	defineProps<{
		isUploaded: boolean
		imgUrl?: string
		trigHint?: string
		descripHint?: string
	}>(),
	{
		isUploaded: false,
		imgUrl: '',
		trigHint: '上传文件',
		descripHint: '文件'
	}
)
const emit = defineEmits<{
	(e: 'on-upload', file: File): void
	(e: 'on-delete'): void
}>()
const { isUploaded, imgUrl, trigHint, descripHint } = toRefs(props)
const aliossStore = useAlioss()
const uploadRef = ref(null)
const beforeFileUpload = (file: File) => {
	emit('on-upload', file)
	return false
}
// const handleView = () => (isShow.value = true)
const handleDelete = () => emit('on-delete')
const handleUpload = () => {
	const inputFile = document.getElementsByClassName('el-upload__input')[0] as HTMLElement
	inputFile.click()
}

// 获取阿里云sts凭证
aliossStore.FetchSTS()
</script>

<style lang="scss" scoped>
.file-uploader-container {
	@include layout(100%, 100%, 0, 0);
	@include position(relative);
	.file-uploader {
		@include layout(100%, 100%, 0, 0);
		&:deep {
			.el-upload {
				@include layout(100%, 100%, 0, 0);
				.trigger-area {
					@include layout(100%, 100%, 0, 0);
					@include flex-box(row, center, center);
					@include border(1.5px dashed #ccc, 4px);
					font-size: 16px;
					&:hover {
						color: var(--el-color-primary);
						border-color: var(--el-color-primary);
					}
				}
			}
		}
	}
	.file-img-container {
		@include position(absolute, 0, 0);
		@include layout(100%, 100%, 0, 0);
		@include border(1px solid var(--el-color-primary), 4px);
		.file-img {
			@include layout(100%, 100%, 0, 0);
			@include border(1px solid transparent, 4px);
			object-fit: cover;
		}
		.file-cover {
			@include position(absolute, 0, 0);
			@include layout(100%, 100%, 0, 0);
			@include flex-box(column, center, center);
			@include border(1px solid transparent, 4px);
			@include transition(all 0.5s ease);
			background-color: transparent;
			html.dark & {
				background-color: #00000030;
			}
			@include pointer;

			&:hover {
				background-color: #00000050;

				html.dark & {
					background-color: #00000080;
				}
			}
			.file-ctrl {
				color: #fff;
				font-size: 14px;
				margin: 16px 0;
				@include pointer;
				&:hover {
					color: var(--el-color-primary);
				}
			}
		}
	}
	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 0.5s ease;
	}
	.fade-enter-from,
	.fade-leave-to {
		opacity: 0;
	}
}
</style>
