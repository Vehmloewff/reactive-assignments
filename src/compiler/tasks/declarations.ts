import { Node, VariableDeclaration } from 'estree';
import MagicString from 'magic-string';
import search from '../search';
import provideLocation from '../lib/provide-location';
import getPos from '../lib/get-pos';

export default (parsed: Node, s: MagicString, initial: string): MagicString => {
	const declarations = search(parsed, `type`, `VariableDeclaration`);

	declarations.forEach((declaration: VariableDeclaration) => {
		let varName: string;
		let value: string;

		// Get the declaration data
		if (declaration.declarations.length !== 1) throw new Error(`An identifer was expected ${provideLocation(declaration.loc)}`);
		if (declaration.kind === `const`) return; // const declarations should not be updated, so there is no need to make them reactive
		const unit = declaration.declarations[0];

		// Get the variable name
		if (unit.id.type === 'Identifier') {
			varName = unit.id.name;
		} else {
			throw new Error(`An identifer was expected ${provideLocation(unit.loc)}`);
		}

		// Get the value
		value = initial.slice(getPos(unit.init).start, getPos(unit.init).end);

		// Write the reactive lines
		const toInsert = `const ${varName} = $$store.writableStore(${value});`;

		// Write it to the string
		s.overwrite(getPos(declaration).start, getPos(declaration).end, toInsert);
	});

	return s;
};
