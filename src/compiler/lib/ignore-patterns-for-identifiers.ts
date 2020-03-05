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

	// Assignment identifiers
	{
		hasKey: `left`,
		isSibling: {
			key: `type`,
			value: `AssignmentExpression`,
		},
	},

	// Function declarations
	{
		hasKey: `id`,
		isSibling: {
			key: `type`,
			value: `FunctionDeclaration`,
		},
	},

	// Function paramaters
	{
		hasKey: `params.{n}`,
	},

	// Import statements
	{
		isSibling: {
			key: `type`,
			value: `ImportNamespaceSpecifier`,
		},
	},
	{
		isSibling: {
			key: `type`,
			value: `ImportDefaultSpecifier`,
		},
	},
	{
		isSibling: {
			key: `type`,
			value: `ImportSpecifier`,
		},
	},

	// Objects
	{
		isSibling: {
			key: `type`,
			value: `Property`,
		},
		hasKey: `key`,
	},
];

export default toIgnore;
