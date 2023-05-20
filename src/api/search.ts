export function navbarSearch<T = Array<SearchType>>(text: string) {
	return GET<T>({
		url: '/search/merge-search',
		params: { text },
		cache: false
	})
}
