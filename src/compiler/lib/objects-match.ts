import flat from 'flat';

type AnyObject = { [key: string]: any };

export default (x: AnyObject, y: AnyObject): boolean => {
	const flatX = <any>flat(x);
	const flatY = <any>flat(y);

	let matches = true;

	Object.keys(flatX).forEach(key => {
		const value1 = flatX[key];
		const value2 = flatY[key];

		if (value1 !== value2) matches = false;
	});

	Object.keys(flatY).forEach(key => {
		const value1 = flatX[key];
		const value2 = flatY[key];

		if (value1 !== value2) matches = false;
	});

	return matches;
};
