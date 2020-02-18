import { Node, VariableDeclaration } from 'estree';
import MagicString from 'magic-string';
import search from '../search';
import provideLocation from '../lib/provide-location';
import getPos from '../lib/get-pos';

export default (parsed: Node, s: MagicString): MagicString => {
	const declarations = search(parsed, `type`, `VariableDeclaration`);

	declarations.forEach((declaration: VariableDeclaration) => {
		let varName: string;
		let reactiveLines: string;

		// Get the declaration data
		if (declaration.declarations.length !== 1) throw new Error(`An identifer was expected ${provideLocation(declaration.loc)}`);
		if (declaration.kind === `const`) return; // const declarations should not be updated, so there is no need to make them reactive

		const unit = declaration.declarations[0];
		if (unit.id.type === 'Identifier') {
			varName = unit.id.name;
		} else {
			throw new Error(`An identifer was expected ${provideLocation(unit.loc)}`);
		}

		// Write the reactive lines
		reactiveLines = `\nconst $${varName} = $$store.writableStore(${varName});`;
		reactiveLines += `\n$${varName}.subscribe(v => ${varName} = v);`;

		// Write it to the string
		s.appendLeft(getPos(declaration).end, reactiveLines);
	});

	return s;
};
