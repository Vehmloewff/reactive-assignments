import flat from 'flat';
import makeTree from './lib/make-tree';

type T = { [key: string]: any };

export default (obj: T, key: string, value: string): T[] => {
	const flattened = flat(obj) as T;
	const result: T[] = [];

	for (let path in flattened) {
		const lastKey = contains(path);
		if (lastKey === key && flattened[path] === value) {
			result.push(makeTree(makeArrayPath(path), obj));
		}
	}

	return result;
};

function contains(test: string) {
	const tests = test.split('.');

	return tests[tests.length - 1];
}

function makeArrayPath(key: string): string[] {
	const result = key.split('.');
	result.pop();

	return result;
}
