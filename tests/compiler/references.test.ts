import { describe } from 'zip-tap';
import { compile, CompileOptions } from '../../src/compiler/index';

const options: CompileOptions = {
	sections: ['references'],
};

describe(`Reactive References`, it => {
	it(`should replace references to the var with [var].get()`, expect => {
		const sourceCode = `foo`;
		const expected = `($$store.isStore(foo) ? foo.get() : foo)`;

		expect(compile(sourceCode, options).code).toBe(expected);
	});

	it(`should not work on declarations`, expect => {
		const sourceCode = `let foo = bar`;
		const expected = `let foo = ($$store.isStore(bar) ? bar.get() : bar)`;

		expect(compile(sourceCode, options).code).toBe(expected);
	});

	it(`should not work on labeled statements`, expect => {
		const sourceCode = `$: foo`;
		const expected = `$: ($$store.isStore(foo) ? foo.get() : foo)`;

		expect(compile(sourceCode, options).code).toBe(expected);
	});

	it(`should not work on object keys`, expect => {
		const sourceCode = `foo.me.you`;
		const expected = `($$store.isStore(foo) ? foo.get() : foo).me.you`;

		expect(compile(sourceCode, options).code).toBe(expected);
	});

	it(`should ignore some globals`, expect => {
		const sourceCode = `console.log(process.env, foo);`;
		const expected = `console.log(process.env, ($$store.isStore(foo) ? foo.get() : foo));`;

		expect(compile(sourceCode, Object.assign({}, options, { predefinedGlobals: [`console`, `process`] })).code).toBe(expected);
	});

	it(`should work in a real-life setting`, expect => {
		const sourceCode = `if (foo === 'bar') console.log('Hello, World!');`;
		const expected = `if (($$store.isStore(foo) ? foo.get() : foo) === 'bar') console.log('Hello, World!');`;

		expect(compile(sourceCode, Object.assign({}, options, { predefinedGlobals: [`console`, `process`] })).code).toBe(expected);
	});
});
