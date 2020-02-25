import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import sucrase from '@rollup/plugin-sucrase';
import globFiles from 'rollup-plugin-glob-files';
import command from 'rollup-plugin-command';

import generateCompilerMeta from './commands/generate-compiler-meta';
import buildCompilerForLiveTests from './commands/build-compiler-for-lt';
import transformLtFiles from './commands/transform-lt-files';

const prod = process.env.NODE_ENV === 'production';
const liveMode = process.env.TEST_LIVE;
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
	output: { file: `dist/test.js`, format: 'cjs' },
	plugins: plugins.concat(
		globFiles({
			key: `@tests`,
			include: `./tests/**/*.ts`,
			justImport: true,
		}),
		command(`node dist/test.js`, { exitOnFail: !watching })
	),
};

const liveTest = {
	input: `@liveTests`,
	output: { file: `dist/live-tests-raw.js`, format: 'cjs' },
	plugins: [
		buildCompilerForLiveTests,
		resolve(),
		commonjs(),
		globFiles({
			key: `@liveTests`,
			include: `./tests/compiler/fixture/**/*.js`,
			justImport: true,
		}),
		transformLtFiles,
		command(`node dist/live-tests-raw.js`, { exitOnFail: !watching }),
	],
};

export default prod ? [compiler, runtime] : liveMode ? liveTest : test;
