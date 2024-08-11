# Gloop

Game loop framework for building tiny games. Philosophy is to keep the plugins
and utilities small and discrete, so that only the dependencies required for the
unique use cases of each game are included.

## Core Class

A class that can construct a game instance and handle plugins, state, events,
and game loops for logic and paints.

## Plugins

Game functionality can be extended with plugins.

| name              | description                                                       |
| :---------------- | :---------------------------------------------------------------- |
| `debug`           | Logs events and adds an overlay for game controls and stats.      |
| `localStore`      | Persists game state to browser local storage.                     |
| `pauseWhenHidden` | Pause the game when the window loses visibility (tab switch)      |
| `scene`           | Define scenes with setup/teardown functions to organize game flow |
| `sprites`         | Keep track of active objects, including positions within a grid   |

## Utilities

Some helpful tools that may be used by plugins or useful for game building.

| name              | description                                               |
| :---------------- | :-------------------------------------------------------- |
| `$dom`            | jQuery like utility for dom manipulation                  |
| `assertNumber`    | Check for numbers, fix floating point discrepancies       |
| `asyncBackground` | Async/await for inline functions running in web workers   |
| `Canvas`          | Wrapper for HTML canvas elements                          |
| `color`           | Functions for manipulating and converting colors          |
| `loop`            | Basic function for timing loops and requestAnimationFrame |
| `makeGuid`        | Factory for globally unique identifiers                   |
| `makeNoise`       | Factory for generating perflin and fractal noise          |
| `makeRandom`      | Factory for generating psuedo random numbers              |
| `vector`          | Functions for vector math and operations                  |

## Demos

A few examples of different ways that Gloop can be used.

| name        | description                                    |
| :---------- | :--------------------------------------------- |
| `bloop`     | Simple physics simulation with colliding balls |
| `maze`      | Simple maze based game                         |
| `noise`     | Demo page using noise generation and workers   |
| `tictactoe` | the game                                       |
| `zap`       | tbd                                            |
