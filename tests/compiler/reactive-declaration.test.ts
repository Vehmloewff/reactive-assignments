import { describe } from 'zip-tap';
import { compile } from '../../src/compiler/index';

const createExpected = (lines: string[]) => {
	return `import $$store from 'reactivejs';\n\n` + lines.join('\n');
};

describe(`Reactive Declarations`, it => {
	it(`should add another declaration after the initial`, expect => {
		const sourceCode = `let foo = 'bar';`;
		const expected = createExpected([`let foo = 'bar';`, `const $foo = $$store.writableStore(foo);`, `$foo.subscribe(v => foo = v);`]);

		expect(compile(sourceCode).code).toBe(expected);
	});

	it(`should do nothing to 'const' declarations`, expect => {
		const sourceCode = `const foo = 'bar';`;
		const expected = createExpected([`const foo = 'bar';`]);

		expect(compile(sourceCode).code).toBe(expected);
	});

	it(`should service vars regardless of location or rank`, expect => {
		const sourceCode = [`let foo = 'bard';`, `let moo = 'boo';`, `if (moo && foo) {`, `let something = 'other'`, `}`].join('\n');
		const expected = createExpected([
			`let foo = 'bard';`,
			`const $foo = $$store.writableStore(foo);`,
			`$foo.subscribe(v => foo = v);`,
			`let moo = 'boo';`,
			`const $moo = $$store.writableStore(moo);`,
			`$moo.subscribe(v => moo = v);`,
			`if (moo && foo) {`,
			`let something = 'other'`,
			`const $something = $$store.writableStore(something);`,
			`$something.subscribe(v => something = v);`,
			`}`,
		]);

		expect(compile(sourceCode).code).toBe(expected);
	});

	it(`should service vars inside reactive blocks`, expect => {
		const sourceCode = [`$: {`, `let moo = 'boo';`, `console.log(moo);`, `}`].join('\n');
		const expected = createExpected([
			`$: {`,
			`let moo = 'boo';`,
			`const $moo = $$store.writableStore(moo);`,
			`$moo.subscribe(v => moo = v);`,
			`console.log(moo);`,
			`}`,
		]);

		expect(compile(sourceCode).code).toBe(expected);
	});
});
