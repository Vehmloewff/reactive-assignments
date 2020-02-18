import { SourceLocation } from 'estree';

export default (loc: SourceLocation) => `at ${loc.start.line}:${loc.start.column}`;
