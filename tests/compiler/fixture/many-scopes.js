console.log(`\n\n\nExpected output:  sayHello will be called once, but the 'console.log' in that function will be called twice.`);

function sayHello(name) {
	console.log(`Called once`);

	$: console.log(`Hello, ${name} - called twice`);
}

let name = `Jerry`;

sayHello(name.valueOf());

name = `Bob`;
