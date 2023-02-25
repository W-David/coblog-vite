// 可能为列表的类型
type Arrayable<T> = T | T[]

type DeviceSize = 'xs'| 'sm' | 'md' | 'lg' | 'xl'

// 分页返回值类型
interface CountRow<T> {
	rows: T[]
	count: number
}
// 全局返回值类型
interface HResponseType<T = any> {
	code: number
	data?: T
	msg: string
}

interface MenuItem {
	id: number,
	path: string,
	name: string
}

interface LinkType {
	type: 'default' | 'primary' | 'success' | 'warning' | 'info' | 'danger'
	href: string
	text: string
}

type ButtonType =
	'primary'
	| 'default'
	| 'text'
	| 'info'
	| 'success'
	| 'danger'
	| 'warning'
	| ''

type TagType = 'success' | 'info' | 'warning'| 'danger' | ''

interface TocItem {
	content: string,
	anchor: string,
	level: number
}

type SearchType = {
	type: 'article' | 'tag' | 'category',
	id: number,
	value: string
}

interface AdminInfo {
	id: number
	nickname: string
	email: string
}

interface Admin {
	avatar: string
	email: string
	id: number
	nickname: string
	token?: string
}

interface ArticleTime {
	id: number
	title: string
	description: string
	browse: string
	month?: string
	week?: string
	day?: string
	createdAt: string
	categories: Array<{
		id: number
		name: string
	}>
	tags: Array<{
		id: number
		name: string
	}>
	browse: number
}

interface ArticleArchive {
	time: string,
	articles: Array<ArticleTime>
}

interface ArticleRecent {
	id: number
	title: string
	description: string
	adminId: number
	banner: {
		id: number
		path?: string
	} | null
	browse: number
	createdAt: string
	updatedAt?: string
	status: number
}
interface ArticleHot {
	id: number
	title: string
	banner: {
		id: number
		path?: string
	} | null
	description: string
	favoCount?: string
	FavoAdmins?: Array<{
		favoCount: string
	}>
	createdAt: string
	updatedAt?: string
	status: number
}

interface Article {
	id: number
	title: string
	description: string
	content?: string
	banner: {
		id: number
		path?: string
	} | null
	adminId: string
	admin: Admin
	categories?: Array<{
		id: number
		name: string
	}>
	tags?: Array<{
		id: number
		name: string
	}>
	browse: number
	createdAt: string
	updatedAt?: string
	tocArray?: Array<TocItem>
	isFavorited?: boolean,
	favoritedNum?: number,
	htmlContent?: string,
	status: number
}

interface Category {
	id: number
	name: string
	createdAt?: string
	createdBy?: string
	updatedAt?: string
}

interface CategoryArticle extends Category {
	articles: Array<{
		id: number
		title: string
		createdAt: string
	}>
}

interface Tag {
	id: number
	name: string
	createdAt?: string
	createdBy?: string
	updatedAt?: string
}

interface TagArticle extends Tag {
	articles: Array<{
		id: number
		title: string
		createdAt: string
	}>
}