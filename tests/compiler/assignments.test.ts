import { describe } from 'zip-tap';
import { CompileOptions, compile } from '../../src/compiler/index';

const options: CompileOptions = {
	sections: ['assignments'],
};

describe(`Reactive Assignments`, it => {
	it(`should turn assignments into [var].set()`, expect => {
		const sourceCode = `foo = 'bar';`;
		const expected = `$$store.isStore(foo) ? foo.set('bar') : foo = 'bar';`;

		expect(compile(sourceCode, options).code).toBe(expected);
	});

	it(`should work with all sorts of values`, expect => {
		const sourceCode = `foo = { thing1: 'that', thing2: you };`;
		const expected = `$$store.isStore(foo) ? foo.set({ thing1: 'that', thing2: you }) : foo = { thing1: 'that', thing2: you };`;

		expect(compile(sourceCode, options).code).toBe(expected);
	});

	it(`should work with all sorts of assignments`, expect => {
		const sourceCode = `foo += 'that';`;
		const expected = `$$store.isStore(foo) ? foo.set(foo.get() + 'that') : foo += 'that';`;

		expect(compile(sourceCode, options).code).toBe(expected);

		const sourceCode1 = `foo *= 5;`;
		const expected1 = `$$store.isStore(foo) ? foo.set(foo.get() * 5) : foo *= 5;`;

		expect(compile(sourceCode1, options).code).toBe(expected1);
	});

	it(`should also work with object nested assignments`, expect => {
		const sourceCode = `foo.then.there = that;`;
		const expected = [
			`$$store.isStore(foo)`,
			`? foo.update(foo => {`,
			`foo.then.there = that;`,
			`return foo;`,
			`})`,
			`: foo.then.there = that;`,
		].join('\n');

		expect(compile(sourceCode, options).code).toBe(expected);
	});

	it(`should not break exixting code`, expect => {
		const sourceCode = [`import data from './file';`, `data.that = 'some-string';`].join('\n');
		const expected = [
			`import data from './file';`,
			`$$store.isStore(data)`,
			`? data.update(data => {`,
			`data.that = 'some-string';`,
			`return data;`,
			`})`,
			`: data.that = 'some-string';`,
		].join('\n');

		expect(compile(sourceCode, options).code).toBe(expected);
	});
});
