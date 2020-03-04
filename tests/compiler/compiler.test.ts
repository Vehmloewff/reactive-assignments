import { describe } from 'zip-tap';
import { compile } from '../../src/compiler/index';

describe(`Compiler`, it => {
	it(`should work with assignments`, expect => {
		const sourceCode = [
			`function sayHello(name) {`,
			`console.log(\`Hello, \${name}\`);`,
			`}`,
			`\n`,
			`let name = \`Jerry\`;`,
			`\n`,
			`$: sayHello(name);`,
			`\n`,
			`name = \`Bob\`;`,
		].join('\n');

		const expected = [
			`import * as $$store from 'reactive-assignments';`,
			``,
			`function sayHello(name) {`,
			`console.log(\`Hello, \${($$store.isStore(name) ? name.get() : name)}\`);`,
			`}`,
			``,
			``,
			`const name = $$store.writableStore(\`Jerry\`);`,
			``,
			``,
			`$$store.updatable(() => (($$store.isStore(sayHello) ? sayHello.get() : sayHello)(($$store.isStore(name) ? name.get() : name))), sayHello, name);`,
			``,
			``,
			`$$store.isStore(name) ? name.set(\`Bob\`) : name = \`Bob\`;`,
		];

		const transformed = compile(sourceCode);

		expect(transformed.code.trim().split('\n')).toMatchObject(expected);
	});
});
