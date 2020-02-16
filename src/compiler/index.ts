import { parse } from './parse';
import declarations from './tasks/declarations';
import importRuntime from './tasks/import-runtime';

export interface CompileOptions {
	sourcemap?: boolean;
	file?: string;
}

export function compile(code: string, options: CompileOptions = {}): { sitemap: string; code: string } {
	const res = parse(code);

	let { s } = res;
	const { parsed } = res;

	s = importRuntime(parsed, s);
	s = declarations(parsed, s);

	return {
		sitemap: s.generateMap({ source: options.file, file: `${options.file}.map`, includeContent: true }).toString(),
		code: s.toString(),
	};
}
