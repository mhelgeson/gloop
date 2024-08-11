# Gloop

The `Gloop` class is a game loop implementation that provides a set of features
to manage the state and timing of a game loop.

## Features

- **State Management**: The `Gloop` class maintains a state object that keeps track of the game's state, such as whether the game is paused, stopped, or the current clock value.
- **Event Handling**: The `Gloop` class provides an event system that allows you to listen for and emit various events, such as state changes, loop start/stop, and clock events.
- **Game Loops**: The `Gloop` class manages two main game loops: a logic loop and a paint loop. The logic loop is responsible for updating the game state, while the paint loop is responsible for rendering the game.

## Usage

Here's an example of how you can use the `Gloop` class:

```javascript
import Gloop from "./Gloop";

const gloop = new Gloop();

// Listen for state changes
gloop.on("state_change", ({ key, value, previous }) => {
  console.log(`State changed: ${key} = ${value} (previous value: ${previous})`);
});

// update your game at ~200fps
game.on("loop_logic", ({ tick }) => {
  // tick value approx 0.005 (sec)
});

// render your game at ~60fps (depends on screen/system)
game.on("loop_paint", ({ tick }) => {
  // tick value approx 0.017 (sec)
});

// Start the game loop
gloop.start();

// Pause the game
gloop.pause();

// Resume the game
gloop.resume();

// Stop the game
gloop.stop();
```

## Methods

<ul>

### `plugin(initializer, options)`

Extend game functionality by registering plugins. The `initializer` is invoked
with the `gloop` instance as `this` and the options passed as an argument. If
the initializer returns an object with a `name` property, the return value will
be assigned to `this[name]`.

### `logic(tick)`

Invoke a single frame of the `logic` loop, which emits a "loop_logic" event. The
`tick` parameters is the number (float) of seconds elapsed.

### `paint(tick)`

Invoke a single frame of the `paint` loop, which emits a "loop_paint" event. The
`tick` parameters is the number (float) of seconds elapsed.

### `step(tick)`

Invoke both the `logic` and `paint` methods with the given `tick`.

### `start()`

Starts the game loops, unless already running. The logic loop runs at
approximately 200 fps, using `setTimeout`. The paint loop runs at approximately
60 fps, using `requestAnimationFrame`.

### `stop()`

Stops the game loops from running.

### `pause()`

Pauses the game clock, but game loops continue running.

### `resume()`

Resumes advancing the game clock.

### `on(type, listener, pre=false)`

Adds a gloop event `listener` for the specified event `type`. If `prepend` is
`true`, the listener will be added to the beginning of the listener list.
Returns a function to deregister the given listener. You can also listen to all
events with a single listener, by using `*` for `type`.

### `off(type, listener)`

Removes the specified event `listener` for the given event `type`. If `listener`
is omitted, all listeners for the specified event `type` will be removed.

### `emit(type, data)`

Dispatches the specified event `type` with the provided `data` as event
properties.

### `set(key, value)`

Sets the `value` of the specified state `key` and emits a "state_change" event
when the value is different. Also accepts an object to set multiple values at
one time.

### `get(key)`

Returns the value of the specified state key. Omit `key` to get a copy of the
entire current state.

</ul>

## Events

<ul>

### `state_change`

The state has been updated. Event includes the `key` that changed, the new
`value` and the `previous` value.

### `loop_start`

The game loops begin running.

### `loop_stop`

The game loops begin running.

### `loop_logic`

A single frame of the logic loop has fired. Event includes `tick` which is the
number of seconds elapsed from the last logic frame.

### `loop_paint`

A single frame of the logic loop has fired. Event includes `tick` which is the
number of seconds elapsed from the last paint frame.

### `clock_pause`

The clock has been paused.

### `clock_resume`

The clock has been unpaused.

### `clock_reset`

The clock has been set to zero.

</ul>

## State

<ul>

### `timewarp`

A factor to multiply how much time has elapsed with each tick. Can be changed to
speed up or slow down the game timing, which is useful for debugging.

### `paused`

A boolean that determines if the game is paused or not.

### `stopped`

A boolean that determines if the game loop is stopped or running.

### `clock`

The current game clock. This is stored in state, but does not emit
"state_change" events from the game loops.

</ul>
