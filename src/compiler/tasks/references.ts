import MagicString from 'magic-string';
import { Node, Identifier, CallExpression, MemberExpression } from 'estree';
import search from '../search';
import getPos from '../lib/get-pos';
import ignorePatterns from '../lib/ignore-patterns-for-identifiers';
import objectsMatch from '../lib/objects-match';

export default (parsed: Node, s: MagicString, code: string, globals: string[]): MagicString => {
	const references = search(parsed, `type`, `Identifier`, ignorePatterns) as Identifier[];
	const callExpressions = search(parsed, `type`, `CallExpression`) as CallExpression[];

	function ignoreGlobals(id: Identifier) {
		return !globals.find(v => v === id.name);
	}

	// Filter out everything that is not foo.valueOf();
	const valueOfCalls = callExpressions.filter(expression => {
		if (expression.callee.type !== `MemberExpression`) return false;
		if (expression.callee.property.type !== `Identifier`) return false;
		if (expression.callee.property.name !== `valueOf`) return false;
		if (expression.callee.object.type !== `Identifier`) return false;

		return true;
	});

	const idsToIgnore = valueOfCalls.map(expression => (expression.callee as MemberExpression).object).filter(ignoreGlobals);

	valueOfCalls.forEach(reference => {
		s.overwrite(getPos(reference).start, getPos(reference).end, ((reference.callee as MemberExpression).object as Identifier).name);
	});

	references
		.filter(ignoreGlobals)
		.filter(id => {
			return !idsToIgnore.find(v => objectsMatch(v, id));
		})
		.forEach(reference => {
			const n = reference.name;

			s.overwrite(getPos(reference).start, getPos(reference).end, `($$store.isStore(${n}) ? ${n}.get() : ${n})`);
		});

	return s;
};
