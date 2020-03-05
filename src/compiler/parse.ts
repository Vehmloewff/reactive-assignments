import { parse as parseEs } from 'acorn';
import MagicString from 'magic-string';
import { Node } from 'estree';

interface ParseResult {
	s: MagicString;
	parsed: Node;
}

function generatePointer(n: number): string {
	return `       ${generateWhitespace(n)}^`;
}

function generateWhitespace(length: number) {
	let str = ``;
	for (let i = 0; i < length; i++) str += ` `;
	return str;
}

function makeThreeDigits(n: number): string {
	const length = String(n).length;
	return generateWhitespace(3 - length) + n;
}

function getContext(code: string, line: number, column: number) {
	if (!line) return ``;

	const lines = code.split('\n');

	if (line > lines.length) return ``;

	const back = line - 5;
	const foward = line + 5;
	const extract = lines
		.slice(back < 0 ? 0 : back, foward > lines.length ? lines.length : foward)
		.map((code, index) => `${makeThreeDigits(index + 1 + (back < 0 ? 0 : back))} |  ${code}`);

	extract.splice(line, 0, generatePointer(column));

	return extract.join('\n');
}

export const parse = (code: string): ParseResult => {
	try {
		return {
			s: new MagicString(code),
			parsed: parseEs(code, {
				sourceType: 'module',
				ecmaVersion: 11,
				locations: true,
			}) as Node,
		};
	} catch (e) {
		console.log(`Parse failed!  Dumping context for deubgging purposes.`);
		console.error(getContext(code, e?.loc?.line, e?.loc?.column));
		throw e;
	}
};
