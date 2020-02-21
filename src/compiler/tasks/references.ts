import MagicString from 'magic-string';
import { Node, Identifier } from 'estree';
import search from '../search';
import getPos from '../lib/get-pos';
import ignorePatterns from '../lib/ignore-patterns-for-identifiers';

export default (parsed: Node, s: MagicString, code: string, globals: string[]): MagicString => {
	const references = search(parsed, `type`, `Identifier`, ignorePatterns);

	references.forEach((reference: Identifier) => {
		const n = reference.name;

		if (globals.find(v => v === n)) return;

		s.overwrite(getPos(reference).start, getPos(reference).end, `($$store.isStore(${n}) ? ${n}.get() : ${n})`);
	});

	return s;
};
