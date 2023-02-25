const useScrollPage = ({
	onScrollUp,
	onScrollDown,
	onScroll,
	delay = 200,
}: {
	onScrollUp?: (offset?: number) => any
	onScrollDown?: (offset?: number) => any
	onScroll?: (offset?: number) => any
	delay?: number
}) => {
	let scrollTopCache = 0
	const onScrolling = () => {
		const scrollTop = getScrollTop()
		const offset = scrollTop - scrollTopCache
		scrollTopCache = scrollTop
		onScroll && onScroll(offset)
		if (offset >= 0) {
			onScrollDown && onScrollDown(offset)
		} else {
			onScrollUp && onScrollUp(-offset)
		}
	}
	const onThrottleScroll = throttle(onScrolling, delay)
	onMounted(() =>
		setTimeout(() => window.addEventListener('scroll', onThrottleScroll), 0)
	)
	onUnmounted(() => window.removeEventListener('scroll', onThrottleScroll))
}

export default useScrollPage
