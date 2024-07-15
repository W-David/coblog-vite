import type { Directive, DirectiveBinding } from 'vue'
const ShowOn: Directive = {
	beforeMount(el: any, binding: DirectiveBinding) {
		el.$data_src = binding.value
	},
	mounted(el: any, binding: DirectiveBinding) {
		const { value } = binding
		const appStore = useApp()
		if (value && value instanceof Array && value.length > 0) {
			const sizes = value
			const curSize = appStore.deviceSize
			const needShow = sizes.indexOf(curSize) !== -1
			if (!needShow) {
				el.parentNode && el.parentNode.removeChild(el)
			}
		} else {
			throw new Error('The value of show-on must be an array with at least one element')
		}
	},
	updated(el: any, binding: DirectiveBinding) {
		el.$data_src = binding.value
	}
}
export default ShowOn
