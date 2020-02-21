import { Ignore } from '../search';

const toIgnore: Ignore[] = [
	// Ignore some cases:

	// Variables that are being declared
	{
		hasKey: `id`,
		isSibling: {
			key: 'type',
			value: 'VariableDeclarator',
		},
	},

	// Label ids
	{
		hasKey: `label`,
		isSibling: {
			key: `type`,
			value: `LabeledStatement`,
		},
	},

	// Object keys
	{
		hasKey: `property`,
		isSibling: {
			key: `type`,
			value: `MemberExpression`,
		},
	},
];

export default toIgnore;
