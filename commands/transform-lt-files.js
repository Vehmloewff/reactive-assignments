export default {
	name: `transform-files`,
	transform: async (oldCode, id) => {
		const isFixture = /^.+\/tests\/compiler\/fixture\/.+\.js$/;
		if (!isFixture.test(id)) return null;

		const { compile } = require('./compiler/index');
		const { code, sourcemap } = compile(oldCode, { reactivejs: '../../../' });
		console.log(code);

		return code;
	},
};
