import { parse } from './parse';
import declarations from './tasks/declarations';
import importRuntime from './tasks/import-runtime';

export interface CompileOptions {
	sourcemap?: boolean;
	file?: string;
	sections?: ('import' | 'declarations')[];
}

export function compile(code: string, options: CompileOptions = {}): { sitemap: string; code: string } {
	const res = parse(code);

	let { s } = res;
	const { parsed } = res;

	if (!options.sections) {
		options.sections = ['import', 'declarations'];
	}

	if (options.sections.find(v => v === 'import')) s = importRuntime(parsed, s);
	if (options.sections.find(v => v === 'declarations')) s = declarations(parsed, s, code);

	return {
		sitemap: s.generateMap({ source: options.file, file: `${options.file}.map`, includeContent: true }).toString(),
		code: s.toString(),
	};
}
