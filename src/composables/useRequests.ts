import { setGlobalOptions, useRequest } from 'vue-request'
setGlobalOptions({
	manual: false,
	loadingDelay: 500,
	loadingKeep: 1000
})

export default useRequest
