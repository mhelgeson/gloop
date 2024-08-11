# util/loop

Tiny recursive loop function which uses setTimeout or requestAnimationFrame.

## syntax

```
loop(callback, offset?)
```

## arguments

- `callback` {Function} Function invoked for each iteration of the loop and
  receives the elapsed seconds from last invocation as an argument. Callback
  can return `false` to break the loop.

- `offset` {Number} Optional millisecond delay between loop iterations using
  setTimeout. When not provided requestAnimationFrame is used instead.
