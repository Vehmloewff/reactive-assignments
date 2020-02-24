import { describe } from 'zip-tap';
import { compile } from '../../src/compiler/index';

describe(`Compiler`, it => {
	it(`should work with assignments`, expect => {
		const sourceCode = `function sayHello(name) {
	console.log(\`Hello, \${name}\`);
}
		
let name = \`Jerry\`;
		
$: sayHello(name);
		
name = \`Bob\`;`;

		const expected = `import * as $$store from 'reactivejs';
		
function sayHello(name) {
	console.log(\`Hello, \${($$store.isStore(name) ? name.get() : name)}\`);
}
		
let name = $$store.writable(\`Jerry\`);
		
$: sayHello(($$store.isStore(name) ? name.get() : name));
		
$$store.isStore(name) ? name.set(\`Bob\`) : name = \`Bob\`;`;

		expect(compile(sourceCode).code).toBe(expected);
	});
});
