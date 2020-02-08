export interface ReadableStore<T> {
	get: () => T;
	subscribe: (fn: (currentValue: T, initial: boolean) => void) => () => void;
}

export interface StoreActions<T> {
	set: (newValue: T) => void;
	update: (fn: (currentValue: T) => T) => void;
}

export interface WritableStore<T> extends ReadableStore<T>, StoreActions<T> {}

export const writableStore = <T>(startValue: T): WritableStore<T> => {
	let value: T = startValue;
	let subscribers: ((currentValue: T, initial: boolean) => void)[] = [];

	const subscribe = (fn: (currentValue: T, intial: boolean) => void) => {
		fn(value, true);

		subscribers.push(fn);

		return () => (subscribers = subscribers.filter(subscriber => subscriber !== fn));
	};

	const set = (newValue: T) => {
		value = newValue;
		subscribers.forEach(fn => fn(value, false));
	};

	const update = (fn: (currentValue: T) => T) => set(fn(value));

	const get = () => value;

	return {
		subscribe,
		set,
		update,
		get,
	};
};

export const dependantStore = <T>(startValue: () => T, ...updatables: WritableStore<any>[]): WritableStore<T> => {
	const { subscribe, set, update, get } = writableStore(startValue());

	updatables.forEach(updatable => {
		updatable.subscribe(() => set(startValue()));
	});

	return {
		subscribe,
		set,
		update,
		get,
	};
};

export const readableStore = <T>(startValue: T, updater: (actions: StoreActions<T>) => void): ReadableStore<T> => {
	const { subscribe, set, update, get } = writableStore(startValue);

	updater({ set, update });

	return {
		subscribe,
		get,
	};
};
