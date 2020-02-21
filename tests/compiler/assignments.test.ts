import { describe } from 'zip-tap';
import { CompileOptions, compile } from '../../src/compiler/index';

const options: CompileOptions = {
	sections: ['assignments'],
};

describe(`Reactive Assignments`, it => {
	it(`should turn assignments into [var].set()`, expect => {
		const sourceCode = `foo = 'bar';`;
		const expected = [`foo.set('bar');`].join('\n');

		expect(compile(sourceCode, options).code).toBe(expected);
	});

	it(`should work with all sorts of values`, expect => {
		const sourceCode = `foo = { thing1: 'that', thing2: you };`;
		const expected = [`foo.set({ thing1: 'that', thing2: you });`].join('\n');

		expect(compile(sourceCode, options).code).toBe(expected);
	});

	it(`should work with all sorts of assignments`, expect => {
		const sourceCode = `foo += 'that';`;
		const expected = [`foo.set(foo.get() + 'that');`].join('\n');

		expect(compile(sourceCode, options).code).toBe(expected);

		const sourceCode1 = `foo *= 5;`;
		const expected1 = [`foo.set(foo.get() * 5);`].join('\n');

		expect(compile(sourceCode1, options).code).toBe(expected1);
	});

	it(`should also work with object nested assignments`, expect => {
		const sourceCode = `foo.then.there = that;`;
		const expected = [`foo.update(foo => {`, `foo.then.there = that;`, `return foo;`, `});`].join('\n');

		expect(compile(sourceCode, options).code).toBe(expected);
	});
});
