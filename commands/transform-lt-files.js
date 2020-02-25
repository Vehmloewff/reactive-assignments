export default {
	name: `transform-files`,
	transform: async (oldCode, id) => {
		if (/globfile\?.+/.test(id)) return null;

		const { compile } = require('./compiler/index');
		const { code, sourcemap } = compile(oldCode);

		return code;
	},
};
