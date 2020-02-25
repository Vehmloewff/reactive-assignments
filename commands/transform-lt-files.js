import { compile } from '../compiler/index';

export default {
	name: `transform-files`,
	transform: (oldCode, id) => {
		if (/globfile\?.+/.test(id)) return null;

		const { code, sourcemap } = compile(oldCode);

		return code;
	},
};
