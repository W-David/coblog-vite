import Cookies from 'js-cookie'
const userToken = 'COBLOG_TOKEN'

export function encodeToken() {
	const token = getToken()
	return 'Basic ' + token
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
