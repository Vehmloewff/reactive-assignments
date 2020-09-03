import { describe } from 'zip-tap';
import { compile, CompileOptions } from '../../src/compiler/index';

const options: CompileOptions = {
	sections: ['declarations'],
};

describe(`Reactive Declarations`, it => {
	it(`should add another declaration after the initial`, expect => {
		const sourceCode = `let foo = 'bar';`;
		const expected = [`const foo = $$store.writableStore('bar');`].join('\n');

		expect(compile(sourceCode, options).code).toBe(expected);
	});

	it(`should do nothing to 'const' declarations`, expect => {
		const sourceCode = `const foo = 'bar';`;
		const expected = [`const foo = 'bar';`].join('\n');

		expect(compile(sourceCode, options).code).toBe(expected);
	});

	it(`should service vars regardless of location or rank`, expect => {
		const sourceCode = [`let foo = 'bard';`, `let moo = foo;`, `if (moo && foo) {`, `let something = { hi: moo }`, `}`].join('\n');
		const expected = [
			`const foo = $$store.writableStore('bard');`,
			`const moo = $$store.writableStore(foo);`,
			`if (moo && foo) {`,
			`const something = $$store.writableStore({ hi: moo });`,
			`}`,
		].join('\n');

		expect(compile(sourceCode, options).code).toBe(expected);
	});

	it(`should service vars inside reactive blocks`, expect => {
		const sourceCode = [`$: {`, `let moo = 'boo';`, `}`].join('\n');
		const expected = [`$: {`, `const moo = $$store.writableStore('boo');`, `}`].join('\n');

		expect(compile(sourceCode, options).code).toBe(expected);
	});

	it(`should service many nested scopes`, expect => {
		const sourceCode = [`const me = something(() => {let data = 'foo'})`].join('\n');
		const expected = [`const me = writableStore(() => {const data = writableStore('foo')})`].join('\n');

		expect(compile(sourceCode, options).code).toBe(expected);
	});
});
