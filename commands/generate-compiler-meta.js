import write from 'write';

const pkg = {
	main: `index.js`,
	module: `index.mjs`,
	typings: `index.d.ts`,
};
const dts = `export * from '../typings/compiler`;

export default async function() {
	await Promise.all([
		write(`compiler/package.json`, JSON.stringify(pkg)),
		write(`compiler/index.d.ts`, dts),
	]);
}
