const usePrompt = async ({
	content,
	title,
	confirmText = '确认',
	cancelText = '取消',
	callback,
	errorback
}: {
	content: string
	title: string
	confirmText?: string
	cancelText?: string
	callback: (v: string) => void
	errorback: (err: Error) => void
}) => {
	ElMessageBox.prompt(content, title, {
		confirmButtonText: confirmText,
		cancelButtonText: cancelText
	})
		.then(value => {
			if (!value) {
				ElMessage({ message: title + '不可为空', type: 'warning', grouping: true })
				errorback(new Error('prompt value is null'))
			}
			callback(value)
		})
		.catch(error => {
			errorback(error)
		})
}

export default usePrompt
