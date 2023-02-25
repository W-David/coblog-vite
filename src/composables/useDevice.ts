import { device } from 'device.js'

const appStore = useApp()
const useDevice = () => {
	onMounted(() => $_get_device())
	const $_get_device = () => {
		const isTouchDevice = device.mobile || device.tablet
		appStore.isTouchDevice = isTouchDevice
	}
}

export default useDevice
