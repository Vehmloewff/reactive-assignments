import { parse as parseEs } from 'acorn';
import MagicString from 'magic-string';
import { Node } from 'estree';

interface ParseResult {
	s: MagicString;
	parsed: Node;
}

export const parse = (code: string): ParseResult => {
	return {
		s: new MagicString(code),
		parsed: parseEs(code, {
			sourceType: 'module',
			ecmaVersion: 11,
			locations: true,
		}) as Node,
	};
};
