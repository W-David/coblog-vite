import type { Credentials } from 'ali-oss'
import OSS from 'ali-oss'

export function getOssClient(sts: Credentials) {
	const aliossStore = useAlioss()
	return new OSS({
		secure: true,
		region: 'oss-cn-beijing',
		bucket: 'coblog-upload',
		accessKeyId: sts.AccessKeyId,
		accessKeySecret: sts.AccessKeySecret,
		stsToken: sts.SecurityToken,
		refreshSTSToken: async () => {
			const sts = await aliossStore.FetchSTS()
			const stsObj = {
				accessKeyId: sts.AccessKeyId,
				accessKeySecret: sts.AccessKeySecret,
				stsToken: sts.SecurityToken,
			}
			return stsObj
		},
		refreshSTSTokenInterval: 300000,
	})
}
