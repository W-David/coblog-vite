import { describe, expect, it } from 'vitest'
import * as format from '~/utils/format'

describe('utils-test', () => {
	it('getRandomItem', () => {
		const list = [1, 2, 3, 4]
		expect(list).toContain(format.getRandomItem(list))
	})
})
