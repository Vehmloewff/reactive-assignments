import MagicString from 'magic-string';
import { Node, AssignmentExpression } from 'estree';
import search from '../search';
import provideLocation from '../lib/provide-location';
import getPos from '../lib/get-pos';

export default (parsed: Node, s: MagicString, initial: string): MagicString => {
	const assignments = search(parsed, `type`, `AssignmentExpression`);

	assignments.forEach((assignment: AssignmentExpression) => {
		// Only deal with Identifiers for now
		if (assignment.left.type !== 'Identifier' && assignment.left.type !== 'MemberExpression')
			throw new Error(`Expected an identifier at ${provideLocation(assignment.left.loc)}`);

		let reactiveAssignment: string;

		// Change the string for identifiers
		if (assignment.left.type === 'Identifier') {
			const varName = assignment.left.name;
			const value = initial.slice(getPos(assignment.right).start, getPos(assignment.right).end);
			const originalAssignment = initial.slice(getPos(assignment).start, getPos(assignment).end);

			let setValue;
			if (assignment.operator === '=') setValue = value;
			else setValue = `${varName}.get() ${assignment.operator.replace(/=/, ``)} ${value}`;

			reactiveAssignment = `$$store.isStore(${varName}) ? ${varName}.set(${setValue}) : ${originalAssignment}`;
		}
		// For member expressions
		else {
			const [varNode] = search(assignment.left, `type`, `Identifier`, [{ hasKey: `property` }]);
			const varName = varNode.name;
			const entirePart = initial.slice(getPos(assignment).start, getPos(assignment).end);

			reactiveAssignment = `$$store.isStore(${varName})\n? ${varName}.update(${varName} => {\n${entirePart};\nreturn ${varName};\n})\n: ${entirePart}`;
		}

		s.overwrite(getPos(assignment).start, getPos(assignment).end, reactiveAssignment);
	});

	return s;
};
