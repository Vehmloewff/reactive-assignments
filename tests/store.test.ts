import { describe } from 'zip-tap';
import { writableStore, dependantStore, readableStore } from '../src/runtime/store';

describe(`Stores`, it => {
	it(`should update and call the subscribers`, expect => {
		const changes = [`this`, `that`, `then`, `there`];
		let count = 0;

		const myStore = writableStore(changes[count]);

		myStore.subscribe((_, initial) => {
			if (!initial) count++;
		});

		myStore.subscribe(val => {
			expect(val).toBe(changes[count]);
		});

		myStore.set(changes[count + 1]);
		myStore.update(val => {
			expect(val).toBe(changes[count]);
			return changes[count + 1];
		});

		myStore.set(changes[count + 1]);

		myStore.get();

		expect(count).toBe(3);
	});

	it(`should unsubscribe themselves when prompted to do so`, expect => {
		const myStore = writableStore(`this`);

		const unsubscribe = myStore.subscribe(val => expect(val).toBe(`this`));

		unsubscribe();

		myStore.set(`that`);
	});

	it(`readable stores should update themselves accoring to the second param`, expect => {
		const firstStore = writableStore(`that`);

		const mirror = readableStore(`this`, ({ set }) => firstStore.subscribe(val => set(val)));

		expect(mirror.get()).toBe(`that`);

		firstStore.set(`there`);

		expect(mirror.get()).toBe(`there`);
	});

	it(`dependant stores should update when the dependents do`, expect => {
		const store1 = writableStore(`then`);
		const store2 = writableStore(`where`);
		const store3 = writableStore(`happened`);

		const shouldUpdateWhenChildrenDo = dependantStore(() => [store1.get(), store2.get(), store3.get()], store1, store2, store3);

		store2.set(`that`);

		expect(shouldUpdateWhenChildrenDo.get().join(' ')).toBe(`then that happened`);
	});

	it(`the stores should run independent of each other`, expect => {
		const stores = () => writableStore(true);
		const store1 = stores();
		const store2 = stores();

		store1.set(false);

		expect(store2.get()).toBe(true);
	});
});
