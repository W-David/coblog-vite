function easeInOutQuad(t: number, b: number, c: number, d: number) {
	t /= d / 2
	if (t < 1) {
		return (c / 2) * t * t + b
	}
	t--
	return (-c / 2) * (t * (t - 2) - 1) + b
}

// requestAnimationFrame for Smart Animating http://goo.gl/sx5sts
const requestAnimFrame = (function () {
	return (
		window.requestAnimationFrame ||
		function (callback) {
			window.setTimeout(callback, 1000 / 60)
		}
	)
})()

/**
 * Because it's so fucking difficult to detect the scrolling element, just move them all
 */
function move(amount: number) {
	document.documentElement.scrollTop = amount
	// document.body.parentNode.scrollTop = amount
	document.body.scrollTop = amount
}

function position() {
	return (
		document.documentElement.scrollTop ||
		// document.body.parentNode.scrollTop ||
		document.body.scrollTop
	)
}

export function getYPosition(element?: Element): number {
	return element ? element.getBoundingClientRect().top + document.documentElement.scrollTop : 80
}

export function scrollToByView(id: string) {
	document.getElementById(id)?.scrollIntoView({
		behavior: 'smooth', // 定义动画过渡效果, "auto"或 "smooth" 之一,默认为 "auto"
		block: 'start', // 定义垂直方向的对齐, "start", "center", "end", 或 "nearest"之一,默认为 "start"
		inline: 'nearest' // 定义水平方向的对齐, "start", "center", "end", 或 "nearest"之一, 默认为 "nearest"
	})
}

export function scrollTo(to: number, duration: number, callback: () => any) {
	const start = position()
	const change = to - start
	const increment = 20
	let currentTime = 0
	duration = typeof duration === 'undefined' ? 500 : duration
	const animateScroll = function () {
		// increment the time
		currentTime += increment
		// find the value with the quadratic in-out easing function
		const val = easeInOutQuad(currentTime, start, change, duration)
		// move the document.body
		move(val)
		// do the animation unless its over
		if (currentTime < duration) {
			requestAnimFrame(animateScroll)
		} else {
			if (callback && typeof callback === 'function') {
				// the animation is done so lets callback
				callback()
			}
		}
	}
	animateScroll()
}

export function scrollToByEle(element: Element, duration: number, callback: () => any) {
	scrollTo(getYPosition(element) - 76, duration, callback)
}
