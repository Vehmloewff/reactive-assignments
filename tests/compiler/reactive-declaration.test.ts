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
});
