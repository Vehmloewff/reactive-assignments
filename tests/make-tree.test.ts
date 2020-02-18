import { describe } from 'zip-tap';
import makeTree from '../src/compiler/lib/make-tree';

describe(`Make Tree`, it => {
	it(`should find the inner of the object`, expect => {
		expect(
			makeTree(['parent', 'child'], {
				parent: {
					child: {
						baby: 'goo!',
					},
				},
			})
		).toMatchObject({ baby: 'goo!' });
	});

	it(`should work on arrays`, expect => {
		expect(
			makeTree(['parent', '0', 'child'], {
				parent: [
					{
						child: {
							baby: 'goo!',
						},
					},
				],
			})
		).toMatchObject({ baby: 'goo!' });
	});
});
