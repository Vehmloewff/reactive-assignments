import MagicString from 'magic-string';
import { Node, LabeledStatement, Identifier, VariableDeclarator } from 'estree';
import search from '../search';
import getPos from '../lib/get-pos';
import toIgnore from '../lib/ignore-patterns-for-identifiers';

export default (parsed: Node, s: MagicString, initial: string, globals: string[]): MagicString => {
	const labels = search(parsed, `type`, `LabeledStatement`);

	labels.forEach((label: LabeledStatement) => {
		if (label.body.type === 'EmptyStatement') return;

		let inner = initial.slice(getPos(label.body).start, getPos(label.body).end);
		const isBlock = label.body.type !== 'ExpressionStatement';

		if (!isBlock) inner = inner.trim().replace(/;$/, ``); // Remove the final simicolon on inline statments

		const body = isBlock ? inner : `(${inner})`;

		// Get all the variable declarations within the block
		const variableDeclarations = search(label.body, `type`, `VariableDeclarator`)
			.map((declaration: VariableDeclarator) => {
				if (declaration.id.type !== `Identifier`) return;
				return declaration.id.name;
			})
			.filter(v => !!v);

		// Get all the variable refrences within the block
		const variables = search(label.body, `type`, `Identifier`, toIgnore)
			.map((identifier: Identifier) => identifier.name)
			.filter(id => {
				if (globals.find(v => v === id)) return false;
				if (variableDeclarations.find(v => v === id)) return false;

				return true;
			});

		// Remove duplicates
		const uniqueVars = variables.filter((id, i) => variables.indexOf(id) === i);

		s.overwrite(
			getPos(label).start,
			getPos(label).end,
			`$$store.updatable(() => ${body}, ${uniqueVars.join(', ')})${!isBlock ? ';' : ''}`
		);
	});

	return s;
};
