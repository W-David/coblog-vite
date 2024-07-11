const usePrompt = async ({
	content,
	title,
	confirmText = '确认',
	cancelText = '取消',
	callback
}: {
	content: string
	title: string
	confirmText?: string
	cancelText?: string
	callback: (v: string) => Promise<void> | void
}) => {
	const { value } = await ElMessageBox.prompt(content, title, {
		confirmButtonText: confirmText,
		cancelButtonText: cancelText
	})
	if (!value) {
		ElMessage({ message: title + '不可为空', type: 'warning', grouping: true })
		return Promise.reject(new TypeError('input value is unvaliable!'))
	}
	callback(value)
}

export default usePrompt
