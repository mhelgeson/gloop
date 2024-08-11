# util/asyncBackground

Wrap a function so it can be asynchronously invoked in background worker thread.
This creates a `Worker` using the string source of the included functions and
dependencies instead of a separate source file. It also takes care of all the
worker message handling to map invocations to a promise resolved with the result
or rejected with an error.

## Syntax

```js
asyncBackground(backgroundFn, dependencies);
```

## Parameters

- `backgroundFn`
  A function to execute in the background thread via web workers

- `dependencies`
  An array of named dependency functions or javascript strings

## Return value

An async function (returns a promise) that invokes in a bg worker.

## Example

```js
// wrap a recursive fibonacci calculator to run in a worker
const fibonacci = asyncBackground(function fib(num) {
  return (memo[num] = memo[num] ?? (
    num <= 1 ? num : fib(num - 1) + fib(num - 2)
  );
},["const memo = {}"]);

// await the promised result from the worker
const val = await fibonacci(42); // 267914296

// shut down the worker
fibonacci("TERMINATE");
```

## Tips

- dependencies should be named function declarations
- all dependencies must be included, imports will not work
- dependencies can all be strings to be evaluated in worker
- cannot use `window`, `document`, DOM, `performance`
- avoid using `this` in main function scope
- cannot use closures in main function scope
- can use `fetch` for network requests
- can use `OffscreenCanvas` for drawing
- can use `requestAnimationFrame`
