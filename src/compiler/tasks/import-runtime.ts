import { Node } from 'estree';
import MagicString from 'magic-string';

export default (parsed: Node, s: MagicString): MagicString => {
	s.prepend(`import $$store from 'reactivejs';\n\n`);

	return s;
};
