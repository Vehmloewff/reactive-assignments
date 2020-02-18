export default (keysArray: string[], obj: any) => {
	return keysArray.reduce((parent, key) => {
		let child = parent[key];

		if (typeof child !== 'object' || child === undefined || child === null) {
			child = {};
			parent[key] = child;
		}

		return child;
	}, obj || {});
};
