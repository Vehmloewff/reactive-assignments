import MagicString from 'magic-string';
import { Node, Identifier } from 'estree';
import search from '../search';
import getPos from '../lib/get-pos';

export default (parsed: Node, s: MagicString, code: string, globals: string[]): MagicString => {
	const references = search(parsed, `type`, `Identifier`, [
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
	]);

	references.forEach((reference: Identifier) => {
		const n = reference.name;

		if (globals.find(v => v === n)) return;

		s.overwrite(getPos(reference).start, getPos(reference).end, `($$store.isStore(${n}) ? ${n}.get() : ${n})`);
	});

	return s;
};
