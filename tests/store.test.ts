import { describe } from 'zip-tap';
import { writableStore, readableStore, isStore, updatable } from '../src/runtime/store';

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

	it(`the stores should run independent of each other`, expect => {
		const stores = () => writableStore(true);
		const store1 = stores();
		const store2 = stores();

		store1.set(false);

		expect(store2.get()).toBe(true);
	});

	it(`isStore should work be acurate`, expect => {
		const store = writableStore(`hi`);
		const notStore = {
			get: `hi`,
			there: `that`,
		};

		expect(isStore(store)).toBe(true);
		expect(isStore(notStore)).toBe(false);
		expect(isStore({})).toBe(false);
		expect(isStore(true)).toBe(false);
		expect(isStore(`hi`)).toBe(false);
	});

	it(`updatables should call the function correctly`, expect => {
		const store1 = writableStore(`hi`);
		const store2 = readableStore(5);
		const store3 = `hi`;

		let called = 0;

		const unsubscribe = updatable(
			initial => {
				if (initial) return;
				called++;
			},
			store1,
			store2,
			store3
		);

		store1.set(`hiss`);
		store1.set(`how`);

		unsubscribe();

		store1.set(`bow`);

		expect(called).toBe(2);
	});
});
