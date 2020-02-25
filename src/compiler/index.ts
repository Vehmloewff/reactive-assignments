import { parse } from './parse';
import declarations from './tasks/declarations';
import importRuntime from './tasks/import-runtime';
import assignments from './tasks/assignments';
import references from './tasks/references';
import labels from './tasks/labels';

type Section = 'import' | 'references' | 'declarations' | 'assignments' | 'labels';

export interface CompileOptions {
	sourcemap?: boolean;
	file?: string;
	sections?: Section[];
	predefinedGlobals?: string[];
}

export function compile(code: string, options: CompileOptions = {}): { sitemap: string; code: string } {
	const res = parse(code);

	let { s, parsed } = res;

	// Set some default options
	if (!options.sections) {
		options.sections = ['import', 'declarations', 'assignments', 'references'];
	}
	if (!options.predefinedGlobals) {
		options.predefinedGlobals = [`console`];
	}

	const isPlanned = (section: Section) => options.sections.find(v => v === section);

	if (isPlanned('import')) s = importRuntime(parsed, s);
	if (isPlanned('references')) {
		s = references(parsed, s, code, options.predefinedGlobals);
		reset();
	}
	if (isPlanned('declarations')) {
		s = declarations(parsed, s, code);
		reset();
	}
	if (isPlanned('assignments')) {
		s = assignments(parsed, s, code);
		reset();
	}
	if (isPlanned('labels')) s = labels(parsed, s, code, options.predefinedGlobals);

	function reset() {
		code = s.toString();

		const res = parse(code);
		parsed = res.parsed;
		s = res.s;
	}

	return {
		sitemap: s.generateMap({ source: options.file, file: `${options.file}.map`, includeContent: true }).toString(),
		code: s.toString(),
	};
}
