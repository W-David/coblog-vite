import { onBeforeMount, onBeforeUnmount, onMounted } from 'vue'

const WIDTH_LIMIT_LIST = [-1, 768, 992, 1200, 1980, Number.MAX_SAFE_INTEGER]
const WIDTH_DEVICE_NAME_LIST: DeviceSize[] = ['xs', 'sm', 'md', 'lg', 'xl']
const appStore = useApp()

const useWindowResize = () => {
	onMounted(() => $_resize())
	onBeforeMount(() => {
		window.addEventListener('resize', $_resize)
	})
	onBeforeUnmount(() => {
		window.removeEventListener('resize', $_resize)
	})
	const $toggle_device = () => {
		const { width } = document.body.getBoundingClientRect()
		let deviceIdx = 0
		for (let i = 0, len = WIDTH_LIMIT_LIST.length - 1; i < len; i++) {
			if (width > WIDTH_LIMIT_LIST[i] && width <= WIDTH_LIMIT_LIST[i + 1]) {
				deviceIdx = i
				break
			}
		}
		return WIDTH_DEVICE_NAME_LIST[deviceIdx]
	}
	const $_resize = () => {
		if (document.hidden) return
		appStore.deviceSize = $toggle_device()
	}
}

export default useWindowResize
