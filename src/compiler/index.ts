import { parse } from './parse';
import declarations from './tasks/declarations';
import importRuntime from './tasks/import-runtime';
import assignments from './tasks/assignments';

type Section = 'import' | 'declarations' | 'assignments';

export interface CompileOptions {
	sourcemap?: boolean;
	file?: string;
	sections?: Section[];
}

export function compile(code: string, options: CompileOptions = {}): { sitemap: string; code: string } {
	const res = parse(code);

	let { s } = res;
	const { parsed } = res;

	if (!options.sections) {
		options.sections = ['import', 'declarations', 'assignments'];
	}

	const isPlanned = (section: Section) => options.sections.find(v => v === section);

	if (isPlanned('import')) s = importRuntime(parsed, s);
	if (isPlanned('declarations')) s = declarations(parsed, s, code);
	if (isPlanned('assignments')) s = assignments(parsed, s, code);

	return {
		sitemap: s.generateMap({ source: options.file, file: `${options.file}.map`, includeContent: true }).toString(),
		code: s.toString(),
	};
}
