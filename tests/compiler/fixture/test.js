console.log(
	`\n\n\nsayHello should be called three times.  Once for Jerry, once for Bob, and once when 'sayHello' itself changes on line 14.`
);

let sayHello = name => {
	console.log(`Hello, ${name}`);
};

let name = `Jerry`;

// This means, "Run `sayHello(name)` everytime the value of `sayHello` or `name` changes".
$: sayHello(name);

name = `Bob`;

sayHello = name => {
	console.log(`Hi, ${name} - sayHello just changed`);
};
