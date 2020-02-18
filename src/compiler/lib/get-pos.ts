import { Node } from 'estree';

export default (node: Node) => ({
	start: (node as any).start as number,
	end: (node as any).end as number,
});
