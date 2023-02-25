import type { Credentials } from 'ali-oss'

export default defineStore('useAlioss', {
	state: (): { sts: Credentials } => ({
		sts: {
			AccessKeyId: '',
			AccessKeySecret: '',
			SecurityToken: '',
			Expiration: '',
		},
	}),
	getters: {},
	actions: {
		async FetchSTS(): Promise<Credentials> {
			const res = await getSTS()
			if (res.data.code === 200 && res.data.data) {
				const stsObj = res.data.data
				this.sts = stsObj
				return stsObj
			} else {
				return this.sts
			}
		},
	},
})
