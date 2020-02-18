import { Node } from 'estree';
import MagicString from 'magic-string';
import search from '../search';

export default (parsed: Node, s: MagicString): MagicString => {
	search(parsed, `Type`, `VaribileDeclaration`);

	return s;
};
