console.log(`\n\n\nExpected output:  sayHello will be called once, but the 'console.log' in that function will be called twice.`);

function sayHello(name) {
	console.log(`Called once`);

	// Because a reactive `name` was passed into this function on line 14,
	// we can call the `console.log` every time it changes.
	$: console.log(`Hello, ${name} - called twice`);
}

let name = `Jerry`;

// The `.valueOf()` tells the compiler to "proxy" the "reactiveness" of `name` on to `sayHello`
sayHello(name.valueOf());

name = `Bob`;
