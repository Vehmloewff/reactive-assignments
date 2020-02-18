import isPlainObject from 'is-plain-obj';

export default (keysArray: string[], obj: any) => {
	return keysArray.reduce((parent, key) => {
		let child = parent[key];

		if (!isPlainObject(child) && !Array.isArray(child)) {
			child = {};
			parent[key] = child;
		}

		return child;
	}, obj || {});
};
