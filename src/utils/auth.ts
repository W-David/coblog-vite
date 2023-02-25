import { Base64 } from 'js-base64'
import Cookies from 'js-cookie'
const userToken = 'COBLOG_TOKEN'

export function encodeToken() {
	const token = getToken()
	const base64 = Base64.encode(token + ':')
	return 'Basic ' + base64
}

export function getToken() {
	return Cookies.get(userToken)
}

export function setToken(token: string) {
	return Cookies.set(userToken, token)
}

export function removeToken() {
	return Cookies.remove(userToken)
}
