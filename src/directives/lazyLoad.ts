import type { Directive } from 'vue'
const LazyLoad: Directive = {
	beforeMount(el: any, binding: any) {
		el.$data_src = binding.value
	},
	mounted(el: any) {
		IntersectionObserver ? ioEvent(el) : scrollEvent(el)
	},
	updated(el: any, binding: any) {
		el.$data_src = binding.value
	},
	unmounted(el: any) {
		IntersectionObserver && el.$io.disconnect()
	}
}

function ioEvent(el: any) {
	const io = new IntersectionObserver(entries => {
		const realSrc = el.$data_src
		entries[0].isIntersecting && realSrc && (el.src = realSrc)
	})
	el.$io = io
	io.observe(el)
}

function scrollEvent(el: any) {
	const handler = throttle(loadImg, 250)
	loadImg(el)
	window.addEventListener('scroll', () => {
		handler(el)
	})
}

function loadImg(el: any) {
	const clientHeight = getClientHeight()
	const { top, bottom } = el.getBoundingClientRect()
	const realSrc = el.$data_src
	top < clientHeight && bottom > 0 && realSrc && (el.src = realSrc)
}

function getClientHeight() {
	const dClientHeight = document.documentElement.clientHeight
	const bodyClientHeight = document.body.clientHeight
	let clientHeight = 0
	if (bodyClientHeight && dClientHeight) {
		clientHeight = bodyClientHeight < dClientHeight ? bodyClientHeight : dClientHeight
	} else {
		clientHeight = bodyClientHeight > dClientHeight ? bodyClientHeight : dClientHeight
	}
	return clientHeight
}

export default LazyLoad
