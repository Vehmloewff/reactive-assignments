import { describe } from 'zip-tap';
import search from '../src/compiler/search';

describe(`Object Search`, it => {
	it(`should return a valid key`, expect => {
		expect(search({ data: `me`, you: { us: `them` } }, `us`, `them`)).toMatchObject([{ us: `them` }]);
	});

	it(`should work multipule times`, expect => {
		const obj = {
			here: `there`,
			body: {
				here: {
					type: `thinggy`,
					value: `cool`,
				},
				there: {
					type: `var`,
					value: `anything`,
				},
				that: {
					type: `var`,
					value: `pool`,
					children: {
						them: {
							type: `var`,
							data: `mean`,
						},
					},
				},
			},
		};
		const res = [
			{
				type: `var`,
				value: `anything`,
			},
			{
				type: `var`,
				value: `pool`,
				children: {
					them: {
						type: `var`,
						data: `mean`,
					},
				},
			},
			{
				type: `var`,
				data: `mean`,
			},
		];

		expect(search(obj, `type`, `var`)).toMatchObject(res);
	});

	it(`should work with arrays`, expect => {
		const obj = { thing: [{ type: `var`, data: `nothing` }] };
		const res = obj.thing;

		expect(search(obj, `type`, `var`)).toMatchObject(res);
	});

	it(`should be able to ignore when siblings are invalid`, expect => {
		const obj = { thing: { type: `var`, data: { var: `din` } } };

		expect(search(obj, `var`, `din`, [{ isSibling: { key: `type`, value: `var` } }])).toMatchObject([]);
	});

	it(`should be able to ignore when key is invalid`, expect => {
		const obj = { thing: { type: `var`, data: { var: `din` }, other: { var: `din`, me: `you` } } };

		expect(search(obj, `var`, `din`, [{ hasKey: `data` }])).toMatchObject([obj.thing.other]);
	});

	it(`should not require all values to be present`, expect => {
		const obj = { thing: { type: `var`, data: { var: `din` }, other: { var: `din`, me: `you` } } };

		expect(search(obj, `var`, `din`, [{ isSibling: { key: `type`, value: `var` } }])).toMatchObject([]);
	});

	it(`should work up the tree when the key contains a dot`, expect => {
		const obj = { thing: { type: `var`, data: { var: `din` }, other: { var: `din`, me: `you` } } };

		expect(search(obj, `var`, `din`, [{ hasKey: `thing.data` }])).toMatchObject([obj.thing.other]);
	});
});
