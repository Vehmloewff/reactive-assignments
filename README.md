# reactive-assignments

Make javascript assignments reactive via a compiler

> This is an actively developed project. PRs, feedback, feature requests, and bug reports are always welcome here!

## Installation

```shell
npm i reactive-assignments
```

## Usage

```js
import { compile } from 'reactive-assignments/compiler';

console.log(compile(`written code`, options));
// -> { code: `reactive code`, sourcemap: { version: 3, mappings: ';;AAA...', ... } }
```

[See some examples](/tests/compiler/fixture) for information on how the syntax works.

### Compiler Options

Valid options are:

-   `file` _(optional)_ - The name of the file that is being compiled.
-   `sections` _(optional)_ - An array of strings specifing which tasks to run. Valid strings are 'import', 'references', 'declarations', 'assignments', or 'labels'. By default, all tasks are run
-   `predefinedGlobals` _(optional)_ - An array of variables that are not to be messed with. Default is `['console']`
-   `runtime` _(optional)_ - The path to the reactive-assignments runtime. Default is `reactive-assignments`
-   `sourcemap` _(optional)_ - If the compiler should generate sourcemaps or not. Default is `true`

## Strategy

Modern javascript frameworks have become quite good at making javascript reactive. [React](https://reactjs.org), [Vue](https://vuejs.org), and [Svelte](https://svelte.dev) are all reactive. The problem is that they are all linked to the browser. They all have some sort of templating engine, and thus can sometimes be a bit large and slow. The idea of this library is to just make plain javascript reactive. Implementations can come later.

The plan is that normal javascript gets executed normally, but when the compiler comes across this:

```js
$: foo = bar;
```

The value of `bar` will always be bound to `foo`.

The following is the plan to accomplish this.

> Note: To really understand the following examples, you need to be familiar with [reactive-assignments stores](#stores-api).

Via the compiler, this code...

```js
let foo = `bar`;
```

...gets compiled into this:

```js
import $$store from 'reactive-assignments';

const foo = $$store.writableStore(`bar`);
```

References to the variable like this...

```js
if (foo === 'bar') console.log(`Hello, World!`);
```

...are compiled like this:

```js
if (foo.get() === 'bar') console.log(`Hello, World!`);
```

And this...

```js
foo = `baz`;
```

...gets compiled into this:

```js
foo.set(`baz`);
```

Therefore, this...

```js
// Assuming bin has already been declared
$: bin = foo;
```

...can be compiled into this...

```js
$$store.updatable(() => bin.set(foo), foo);
```

...and make `bin` reactive.

Written code:

```js
let foo = `bar`;
let bin;

$: bin = foo;

foo = `baz`;
```

Compiled code:

```js
import * as $$store from 'reactive-assignments';

const foo = $$store.writableStore(`bar`);

const bin = $$store.writableStore();
$$store.updatable(() => bin.set(foo), foo);

foo.set(`baz`);

// bin now equals 'baz' because the $$store.updatable function
// calls the first parameter everytime one of the subsequent parameters
// emits an update.
```

## Development

Pull Requests are encouraged and always welcome!

```sh
# fork repo
git clone https://github.com/[your_username]/reactive-assignments
cd reactive-assignments
npm i
npm test # or npm test -- -w
```

The code can be built via the `npm run build` command. To watch the file system and rebuild on changes, use `npm run build -- -w`.

The runtime library is located in the `src/runtime` folder. The compiler is in the `src/compiler` folder.

This project uses [Prettier](https://prettier.io) for code formatting. Don't forget to `npm run lint` before you commit.

## Stores API

### writableStore

```ts
store = writableStore(value: any);
```

`store` is an object with four methods:

-   `set(value: any) => void` - Sets the store to a new value
-   `get() => any` - Returns the store's current value
-   `update(fn: (currentValue: any) => any) => void` - Will set the value of the store to whatever is returned from `fn`
-   `subscribe(fn: (value: any) => void) => () => void` - Calls `fn` everytime the value of the store changes. Returns a function that will unsubscribe (stop calling `fn` when the value changes) when called

### readableStore

```ts
store = readableStore(startValue: any, actions: ({ set, update }) => void);
```

`store` is an object with all the properties as `writableStore` gives it, except `set` and `update`.

`actions` is a function that is passed in one property, an object containing the missing properties from `store`.

### updatable

```ts
updatable(fn: () => void, ...stores)
```

Calls `fn` everytime one of the store's value changes.

If a value is passed into `stores` that is not a store, reactive-assignments will silently ignore it.

Returns a function that will 'unsubscribe' from the stores when called.

### isStore

```ts
isStore(testValue: any): boolean
```

Just checks to see if `testValue` contains the appropriate `subscribe` and `get` methods.

## License

[MIT](/LICENSE)
