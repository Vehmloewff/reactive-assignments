import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import sucrase from '@rollup/plugin-sucrase';
import globFiles from 'rollup-plugin-glob-files';
import command from 'rollup-plugin-command';

import pkg from './package.json';
import generateCompilerMeta from './commands/generate-compiler-meta.js';

const prod = process.env.NODE_ENV === 'production';
const watching = process.env.ROLLUP_WATCH;

const plugins = [
	resolve(),
	commonjs(),
	sucrase({
		transforms: ['typescript'],
	}),
];

const compiler = {
	input: 'src/compiler/index.ts',
	output: [
		{ file: `compiler/index.js`, format: 'cjs' },
		{ file: `compiler/index.mjs`, format: 'esm' },
	],
	plugins: plugins.concat(command(generateCompilerMeta)),
};

const runtime = {
	input: `src/runtime/index.ts`,
	output: [
		{ file: `dist/index.js`, format: 'cjs' },
		{ file: `dist/index.mjs`, format: 'esm' },
	],
	plugins,
};

const test = {
	input: `@tests`,
	output: [
		{ file: `compiler/index.js`, format: 'cjs' },
		{ file: `compiler/index.mjs`, format: 'esm' },
	],
	plugins: plugins.concat(
		globFiles({
			key: `@tests`,
			include: `./tests/**/*.ts`,
			justImport: true,
		}),
		command(`zip-tap-reporter node ${pkg.main}`, { exitOnFail: !watching })
	),
};

export default prod ? [compiler, runtime] : test;
