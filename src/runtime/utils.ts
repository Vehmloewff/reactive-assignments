export const asyncForeach = async <T>(arr: T[], fn: (value: T, index: number) => Promise<void> | void) => {
	for (let index in arr) {
		await fn(arr[index], Number(index));
	}
};
