import { parse } from './parse';
import declarations from './tasks/declarations';
import importRuntime from './tasks/import-runtime';
import assignments from './tasks/assignments';
import references from './tasks/references';
import labels from './tasks/labels';
import mergeSourceMaps from 'merge-source-map';

type Section = 'import' | 'references' | 'declarations' | 'assignments' | 'labels';

export interface CompileOptions {
	sourcemap?: boolean;
	file?: string;
	sections?: Section[];
	predefinedGlobals?: string[];
	runtime?: string;
}

export function compile(code: string, options: CompileOptions = {}): { sourcemap: string; code: string } {
	const res = parse(code);

	let { s, parsed } = res;

	// Set some default options
	if (!options.sections) {
		options.sections = ['import', 'declarations', 'assignments', 'references', 'labels'];
	}
	if (!options.hasOwnProperty('sourcemap')) options.sourcemap = true;
	if (!options.predefinedGlobals) {
		options.predefinedGlobals = [`console`];
	}
	options.predefinedGlobals.push(`$$store`);

	const isPlanned = (section: Section) => options.sections.find(v => v === section);
	let sourcemap: string;

	if (isPlanned('import')) s = importRuntime(parsed, s, options.file, options.runtime);
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
	if (isPlanned('labels')) {
		s = labels(parsed, s, code, options.predefinedGlobals);
		handleSourceMaps(); // We do not need to rebuild the AST tree, just handle the sourcemaps
	}

	function handleSourceMaps() {
		if (options.sourcemap) {
			const map = s.generateMap({ source: options.file, file: `${options.file}.map`, includeContent: true });
			sourcemap = mergeSourceMaps(map, sourcemap);
		}
	}

	function reset() {
		code = s.toString();

		handleSourceMaps();

		const res = parse(code);
		parsed = res.parsed;
		s = res.s;
	}

	return {
		sourcemap: JSON.stringify(sourcemap),
		code: s.toString(),
	};
}
