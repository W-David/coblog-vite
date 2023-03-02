<template>
	<div class="admin-info-container">
		<el-skeleton :loading="loading" animated>
			<template #template>
				<div class="skeleton-item">
					<el-skeleton-item variant="image" class="avatar"></el-skeleton-item>
					<div class="hint">
						<el-skeleton-item variant="text" class="name"></el-skeleton-item>
						<el-skeleton-item variant="text" class="email"></el-skeleton-item>
					</div>
				</div>
			</template>
			<template #default>
				<div class="admin-info-content">
					<div class="admin-avatar">
						<el-avatar
							:size="64"
							shape="circle"
							:src="`${adminInfo?.avatar}?x-oss-process=image/resize,m_fill,h_64,w_64`"
							fit="cover"
						>
							<span>{{ adminInfo?.nickname.substr(0, 1) ?? '匿' }}</span>
						</el-avatar>
					</div>
					<div class="admin-hint">
						<div class="admin-name">
							<i-custom-profile
								style="
									color: var(--el-color-primary);
									width: 16px;
									height: 16px;
								"
							/>
							{{ adminInfo?.nickname ?? '匿名用户' }}
						</div>
						<div class="admin-email">
							<i-custom-email
								style="
									color: var(--el-color-success);
									width: 16px;
									height: 16px;
								"
							/>
							{{ adminInfo?.email ?? '待完善' }}
						</div>
					</div>
				</div>
			</template>
		</el-skeleton>
	</div>
</template>

<script lang="ts" setup>
const props = withDefaults(
	defineProps<{
		adminInfo?: Admin
		loading: boolean
	}>(),
	{
		loading: true,
	}
)
const { adminInfo, loading } = toRefs(props)
</script>

<style lang="scss" scoped>
.admin-info-container {
	@include layout(100%, auto, 0, 4px);
	@include border(none, 8px);
	@include bg-color(#fff);
	box-shadow: var(--el-box-shadow);

	.skeleton-item {
		@include layout(100%, auto, 0, 16px);
		@include clearfix;
		.avatar {
			float: left;
			width: 64px;
			height: 64px;
			border-radius: 32px;
		}
		.hint {
			margin-left: 72px;
			height: 64px;
			padding-left: 12px;
			@include flex-box(column, center, flex-start);
			.name {
				width: 50%;
				height: 22px;
				margin-bottom: 8px;
			}
			.email {
				width: 80%;
				height: 18px;
			}
		}
	}
	.admin-info-content {
		@include layout(100%, auto, 0, 16px);
		@include clearfix;
		.admin-avatar {
			float: left;
			width: 64px;
			height: 64px;
		}
		.admin-hint {
			margin: 8px 0 8px 72px;
			padding-left: 12px;
			border-left: 0.5px solid var(--el-text-color-secondary);
			@include flex-box(column, center, flex-start);
			.admin-name {
				font-size: 16px;
				color: var(--el-text-color-primary);
				font-weight: bold;
			}
			.admin-email {
				font-size: 16px;
				color: var(--el-text-color-regular);
				@include text-overflow(1, 12px);
			}
		}
	}
}
</style>
