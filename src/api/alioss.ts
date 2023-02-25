import type { Credentials } from 'ali-oss'

export function getSTS<T = Credentials>() {
	return GET<T>({ url: '/alioss/sts' })
}
