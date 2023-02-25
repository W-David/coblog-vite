import { onUnmounted } from 'vue'

const useDOMCreate = (id: string) => {
	const rootNode = document.createElement('div')
	rootNode.id = id
	document.body.append(rootNode)
	onUnmounted(() => {
		document.body.removeChild(rootNode)
	})
}

export default useDOMCreate
