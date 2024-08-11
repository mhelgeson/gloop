import loop from "../util/loop";
import constants from "../constants";

const {
  // event strings
  STATE_CHANGE,
  LOOP_START,
  LOOP_STOP,
  LOOP_LOGIC,
  LOOP_PAINT,
  CLOCK_PAUSE,
  CLOCK_RESUME,
  CLOCK_RESET,
  WILDCARD,
  // state strings
  TIMEWARP,
  PAUSED,
  STOPPED,
  CLOCK,
} = constants;

export default class Gloop {
  // initialize default state
  state = {
    __proto__: null,
    [STOPPED]: true,
    [PAUSED]: false,
    [TIMEWARP]: 1,
    [CLOCK]: 0,
  };
  listeners = new Map();

  constructor() {
    // listeners for special events
    this.on(STATE_CHANGE, ({ key, value }) => {
      if (key === PAUSED) {
        this.emit(value ? CLOCK_PAUSE : CLOCK_RESUME);
      }
      if (key === STOPPED) {
        this.emit(value ? LOOP_STOP : LOOP_START);
      }
      if (key === CLOCK && value === 0) {
        this.emit(CLOCK_RESET);
      }
    });
  }

  plugin(initializer, options) {
    const result = initializer.call(this, options || {});
    // optionally assign named return values
    if (result?.name) {
      this[result.name] = result;
    }
    return this;
  }

  // logic loop frame
  logic(tick) {
    // adjust tick speed to warp time
    tick *= this.get(TIMEWARP);
    // freeze game clock when paused
    if (this.get(PAUSED) === false) {
      // set state directly to bypass unnecessary events
      this.state[CLOCK] += tick;
    }
    this.emit(LOOP_LOGIC, { tick });
    // return false to break the loop
    return this.get(STOPPED) === false;
  }

  // paint loop frame
  paint(tick) {
    // adjust tick speed to warp time
    tick *= this.get(TIMEWARP);
    this.emit(LOOP_PAINT, { tick });
    // return false to break the loop
    return this.get(STOPPED) === false;
  }

  // advance without looping
  step(tick = 1) {
    this.logic(tick);
    this.paint(tick);
  }

  // starts the two main game loops
  start() {
    if (this.get(STOPPED) === true) {
      // reset clock value, speed, direction
      this.set(CLOCK, 0);
      // reset loop and time state
      this.set(PAUSED, false);
      this.set(STOPPED, false);
      // logic engine ~200fps
      loop(this.logic.bind(this), 1000 / 200);
      // paint engine ~60fps
      loop(this.paint.bind(this), null);
    }
  }

  // stop the two main game loops
  stop() {
    this.set(STOPPED, true);
  }

  // pause tracking the game timing
  pause() {
    this.set(PAUSED, true);
  }

  // resume tracking the game timing
  resume() {
    this.set(PAUSED, false);
  }

  // add an event listener
  on(type, listener, pre = false) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    const method = pre === true ? "unshift" : "push";
    this.listeners.get(type)[method](listener);
    // return a deregister function
    return () => this.off(type, listener);
  }

  // remove event listeners
  off(type, listener) {
    if (this.listeners.has(type)) {
      if (listener == null) {
        // remove all listeners
        this.listeners.delete(type);
      } else {
        let list = this.listeners.get(type);
        // remove matching listeners
        list = list.filter((saved) => saved !== listener);
        this.listeners.set(type, list);
      }
    }
  }

  // emit an event to listeners, asynchronously
  emit(type, data) {
    if (this.listeners.has(type) || this.listeners.has(WILDCARD)) {
      // invoke listener on next tick...
      const propagate = (listener) =>
        setTimeout(() => {
          listener.call(this, { ...data, type });
        }, 0);
      this.listeners.get(WILDCARD)?.forEach(propagate); // wildcard
      this.listeners.get(type)?.forEach(propagate);
    }
  }

  // set game state value
  set(key, value) {
    // assign each prop to state
    if (arguments.length === 1) {
      Object.keys(key).forEach((k) => this.set(k, key[k]));
    }
    if (this.get(key) !== value) {
      this.emit(STATE_CHANGE, { key, value, previous: this.state[key] });
      this.state[key] = value;
    }
  }

  // get game state value or copy of all state
  get(key) {
    return key ? this.state[key] : { ...this.state };
  }
}
