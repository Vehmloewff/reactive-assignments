import flat from 'flat';
import makeTree from './lib/make-tree';

type T = { [key: string]: any };

interface Ignore {
	isSibling?: {
		key: string;
		value: string;
	};
	hasKey?: string;
}

export default (obj: T, key: string, value: string, ignore: Ignore[] = []): T[] => {
	const flattened = flat(obj) as T;
	const result: T[] = [];

	for (let path in flattened) {
		const lastKey = contains(path);
		if (lastKey === key && flattened[path] === value) {
			const key = makeArrayPath(path);

			if (shouldIgnore(flattened, key, ignore)) return [];

			result.push(makeTree(key, obj));
		}
	}

	return result;
};

function contains(test: string) {
	const tests = test.split('.');

	return tests[tests.length - 1];
}

function shouldIgnore(obj: T, path: string[], ignore: Ignore[]): boolean {
	let strikes = 0;

	ignore.forEach(item => {
		// Sibling test
		if (item.isSibling) {
			const testPathArr = Array.from(path);
			testPathArr.pop();

			const testPath = testPathArr.concat(item.isSibling.key).join('.');

			if (obj[testPath] === item.isSibling.value) strikes++;
		}

		// Key test
		if (item.hasKey) {
			if (path.length && path[path.length - 1] === item.hasKey) strikes++;
		}
	});

	return !!strikes;
}

function makeArrayPath(key: string): string[] {
	const result = key.split('.');
	result.pop();

	return result;
}
