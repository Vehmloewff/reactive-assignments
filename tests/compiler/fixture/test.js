console.log(`sayHello should be called twice.  Once for Jerry and once for Bob.`);

function sayHello(name) {
	console.log(`Hello, ${name}`);
}

let name = `Jerry`;

$: sayHello(name);

name = `Bob`;
