import flat from 'flat';
import makeTree from './lib/make-tree';

type T = { [key: string]: any };

export interface Ignore {
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

			if (!shouldIgnore(flattened, key, ignore)) {
				result.push(makeTree(key, obj));
			}
		}
	}

	return result;
};

function contains(test: string) {
	const tests = test.split('.');

	return tests[tests.length - 1];
}

function shouldIgnore(obj: T, path: string[], ignore: Ignore[]): boolean {
	let shouldIgnore = false;

	ignore.forEach(item => {
		let didPass = false;

		// Sibling test
		if (item.isSibling) {
			const testPathArr = Array.from(path);
			testPathArr.pop();

			const testPath = testPathArr.concat(item.isSibling.key).join('.');

			if (obj[testPath] !== item.isSibling.value) didPass = true;
		}

		// Key test
		if (item.hasKey) {
			if (path.length) {
				const testPath = item.hasKey.split('.');
				const matchedPath = getItemsAfterIndex(path, path.length - testPath.length);

				if (!doPathsMatch(matchedPath, testPath)) didPass = true;
			} else didPass = true;
		}

		// Finish
		if (!didPass) shouldIgnore = true;
	});

	return shouldIgnore;
}

function getItemsAfterIndex(array: any[], startIndex: number) {
	const res = [];

	for (let i = startIndex; i < array.length; i++) {
		res.push(array[i]);
	}

	return res;
}

function doPathsMatch(path1: string[], path2: string[]): boolean {
	let match = true;

	path1.forEach((item, index) => {
		if (!doStringsMatch(path2[index], item)) match = false;
	});

	return match;
}

function doStringsMatch(string1: string, string2: string): boolean {
	if (string1 === '{n}') return canBeNumber(string2);
	if (string2 === '{n}') return canBeNumber(string1);

	return string1 === string2;
}

function canBeNumber(test: string): boolean {
	return /\d+/.test(test);
}

function makeArrayPath(key: string): string[] {
	const result = key.split('.');
	result.pop();

	return result;
}
