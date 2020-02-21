import { describe } from 'zip-tap';
import { CompileOptions, compile } from '../../src/compiler/index';

const options: CompileOptions = {
	sections: ['labels'],
};

describe(`Reactive Labels`, it => {
	it(`should wrap a labeled statement in an updatable function`, expect => {
		const sourceCode = `$: console.log(foo);`;
		const expected = `$$store.updatable(() => (console.log(foo)), foo);`;

		expect(compile(sourceCode, options).code).toBe(expected);
	});

	it(`should wrap a labeled statement in an updatable function`, expect => {
		const sourceCode = [`$: {`, `console.log(me);`, `};`].join('\n');
		const expected = [`$$store.updatable(() => {`, `console.log(me);`, `}, me);`].join('\n');

		expect(compile(sourceCode, options).code).toBe(expected);
	});

	it(`should ignore local variables`, expect => {
		const sourceCode = [`$: {`, `let me = 'you' + foo;`, `console.log(me);`, `};`].join('\n');
		const expected = [`$$store.updatable(() => {`, `let me = 'you' + foo;`, `console.log(me);`, `}, foo);`].join('\n');

		expect(compile(sourceCode, options).code).toBe(expected);
	});
});
