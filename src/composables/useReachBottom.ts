const useReachBottom = (callback: () => any) => {
	const onScroll = () => {
		const scrollTop = getScrollTop()
		const windowHeight = getWindowHeight()
		const scrollHeight = getScrollHeight()
		const offset = 60
		const isReachBottom = scrollTop + windowHeight >= scrollHeight - offset
		// debugger
		if (!isReachBottom) return
		if (callback) callback()
	}
	const onThrottleScroll = throttle(onScroll, 200)
	onMounted(() =>
		setTimeout(() => window.addEventListener('scroll', onThrottleScroll), 0)
	)
	onUnmounted(() => window.removeEventListener('scroll', onThrottleScroll))
}

export default useReachBottom
