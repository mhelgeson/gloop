# Gloop Class Documentation

The `Gloop` class is a game loop implementation that provides a set of features to manage the state and timing of a game loop.

## Features

- **State Management**: The `Gloop` class maintains a state object that keeps track of the game's state, such as whether the game is paused, stopped, or the current clock value.
- **Event Handling**: The `Gloop` class provides an event system that allows you to listen for and emit various events, such as state changes, loop start/stop, and clock events.
- **Game Loops**: The `Gloop` class manages two main game loops: a logic loop and a paint loop. The logic loop is responsible for updating the game state, while the paint loop is responsible for rendering the game.
- **Time Warping**: The `Gloop` class allows you to adjust the speed of the game loop by setting a time warp factor.

## Usage

Here's an example of how you can use the `Gloop` class:

```javascript
import Gloop from './Gloop';

const gloop = new Gloop();

// Listen for state changes
gloop.on(constants.STATE_CHANGE, (key, value, prevValue) => {
  console.log(`State changed: ${key} = ${value} (previous value: ${prevValue})`);
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

API
Constructor
javascript

Insert at cursor

Copy
constructor()
Initializes the 
Gloop
 instance with default state values.

Methods
start()
Starts the game loop if the game is currently stopped.

stop()
Stops the game loop.

pause()
Pauses the game loop.

resume()
Resumes the game loop.

on(type, listener, pre = false)
Adds an event listener for the specified event type. If 
pre
 is 
true
, the listener will be added to the beginning of the listener list.

off(type, listener)
Removes the specified event listener. If 
listener
 is 
null
, all listeners for the specified event type will be removed.

emit(type, args)
Emits the specified event type with the provided arguments.

set(key, value)
Sets the value of the specified state key and emits a 
STATE_CHANGE
 event.

get(key)
Returns the value of the specified state key.

Constants
The 
Gloop
 class uses the following constants, which are imported from the 
../constants
 module:

STATE_CHANGE

LOOP_START

LOOP_STOP

LOOP_LOGIC

LOOP_PAINT

CLOCK_PAUSE

CLOCK_RESUME

CLOCK_RESET

WILDCARD

TIMEWARP

PAUSED

STOPPED

CLOCK
