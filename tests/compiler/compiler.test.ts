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

	it(`should be ok with many scopes`, expect => {
		const sourceCode = [
			`import { createApplication, createDomRenderer, createComponent } from '../../src';`,
			``,
			`const instance = createApplication();`,
			`instance.setRenderer(`,
			`createDomRenderer({`,
			`getRealBearings: instance.getRealBearings,`,
			`homeDomId: \`app-root\`,`,
			`})`,
			`);`,
			`const app = instance.init();`,
			`const root = createComponent(() => {`,
			`const value = \`Hello, world!\`;`,
			``,
			`return {`,
			`template: {`,
			`text1: app.components.Text({ value: \`\` }),`,
			`},`,
			`onMount() {`,
			`console.log('Hello world!');`,
			`},`,
			`};`,
			`});`,
			``,
			`app.bootstrap(root);`,
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
