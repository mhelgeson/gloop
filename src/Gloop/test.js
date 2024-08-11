import { jest } from "@jest/globals";
import Gloop from "../Gloop";
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

describe("Gloop", () => {
  let gloop;

  beforeEach(() => {
    jest.useRealTimers();
    gloop = new Gloop();
  });

  afterEach(() => {
    gloop.stop();
  });

  describe("constructor", () => {
    test.each([
      [TIMEWARP, 1],
      [PAUSED, false],
      [STOPPED, true],
      [CLOCK, 0],
    ])('initial state "%s" = %s', (key, value) => {
      expect(gloop.get(key)).toBe(value);
    });
  });

  describe("plugin", () => {
    it("should invoke initializer with correct scope", () => {
      let scope = null;
      gloop.plugin(function () {
        scope = this;
      });
      expect(scope).toBe(gloop);
    });
    it("should pass along options to initializer", () => {
      let options = null;
      gloop.plugin((arg) => (options = arg), { foo: 123 });
      expect(options).toStrictEqual({ foo: 123 });
    });
    it("should assign initializer return value to scope when 'name' is included", () => {
      gloop.plugin(() => ({ name: "wow", foo: 123 }));
      expect(gloop.wow.foo).toBe(123);
      expect(gloop.wow.name).toBe("wow");
    });
  });

  describe("state: get/set", () => {
    test("set and get state values", async () => {
      const attr = "surge";
      const value = "adhesion";
      gloop.set(attr, value);
      expect(gloop.get(attr)).toBe(value);
    });

    test("set multiple and get all state values", async () => {
      gloop.set({
        foo1: "bar1",
        foo2: "bar2",
        foo3: "bar3",
      });
      const state = gloop.get();
      expect(Object.keys(state).length).toBeGreaterThanOrEqual(3);
      expect(state.foo1).toBe("bar1");
      expect(state.foo2).toBe("bar2");
      expect(state.foo3).toBe("bar3");
    });

    test(`emits "${STATE_CHANGE}" event when value changes`, async () => {
      const attr = "spren";
      const value = "honor";
      const original = gloop.get(attr);
      await new Promise((resolve, reject) => {
        gloop.on(STATE_CHANGE, ({ key, value, previous }) => {
          expect(key).toBe(attr);
          expect(value).toBe(value);
          expect(previous).toBe(original);
          expect(value !== previous).toBe(true);
          resolve();
        });
        gloop.set(attr, original); // no-op
        gloop.set(attr, value);
      });
    });
  });

  describe("clock: pause/resume/reset", () => {
    test(`emits "${CLOCK_PAUSE}" event on "pause"`, async () => {
      await new Promise((resolve, reject) => {
        const remove_listener = gloop.on(CLOCK_PAUSE, () => {
          expect(gloop.get(PAUSED)).toBe(true);
          remove_listener();
          resolve();
        });
        gloop.pause();
        expect(gloop.get(PAUSED)).toBe(true);
      });
    });
    test(`emits "${CLOCK_RESUME}" event on "resume"`, async () => {
      await new Promise((resolve, reject) => {
        gloop.set(PAUSED, true);
        const remove_listener = gloop.on(CLOCK_RESUME, () => {
          expect(gloop.get(PAUSED)).toBe(false);
          remove_listener();
          resolve();
        });
        gloop.resume();
        expect(gloop.get(PAUSED)).toBe(false);
      });
    });
    test(`emits "${CLOCK_RESET}" event when clock is set to zero`, async () => {
      await new Promise((resolve, reject) => {
        gloop.set(CLOCK, 123);
        const remove_listener = gloop.on(CLOCK_RESET, () => {
          expect(gloop.get(CLOCK)).toBe(0);
          remove_listener();
          resolve();
        });
        gloop.set(CLOCK, 0);
      });
    });
  });

  describe("loop: start/stop", () => {
    test(`emits "${LOOP_START}" event on "start"`, async () => {
      await new Promise((resolve, reject) => {
        const remove_listener = gloop.on(LOOP_START, () => {
          expect(gloop.get(STOPPED)).toBe(false);
          remove_listener();
          resolve();
        });
        gloop.start();
      });
    });
    test(`emits "${LOOP_STOP}" event on "stop"`, async () => {
      await new Promise((resolve, reject) => {
        gloop.set(STOPPED, false);
        const remove_listener = gloop.on(LOOP_STOP, () => {
          expect(gloop.get(STOPPED)).toBe(true);
          remove_listener();
          resolve();
        });
        gloop.stop();
      });
    });
    test(`calling "start" again does nothing`, () => {
      jest.useFakeTimers({ now: new Date() });
      gloop.set(CLOCK, 23);
      gloop.start();
      expect(gloop.get(CLOCK)).toBe(0);
      gloop.set(CLOCK, 19);
      gloop.start(); // clock does not reset
      expect(gloop.get(CLOCK)).toBe(19);
    });
  });

  describe("loop: step/logic/paint", () => {
    test("'step' invokes logic and paint without looping", async () => {
      let logic_tick = 0;
      let paint_tick = 0;
      gloop.on(LOOP_LOGIC, ({ tick }) => (logic_tick += tick));
      gloop.on(LOOP_PAINT, ({ tick }) => (paint_tick += tick));
      gloop.step(); // default is 1 sec
      gloop.step(99);
      // wait for events to be emitted
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          expect(logic_tick).toBe(100);
          expect(paint_tick).toBe(100);
          resolve();
        }, 1);
      });
    });
    test(`emits "${LOOP_LOGIC}" event on 200 FPS interval, advances clock when not paused`, async () => {
      jest.useFakeTimers({ now: new Date() });
      await new Promise((resolve, reject) => {
        let frame = 0;
        let clock = 0;
        let paused_at = 0;
        const expected_ticks = [0, 1 / 201, 1 / 201, 1 / 201, 1 / 201, 1 / 201];
        gloop.on(LOOP_LOGIC, ({ tick }) => {
          clock += tick;
          if (frame === 3) {
            gloop.pause();
            paused_at = clock;
          }
          if (typeof expected_ticks[frame] === "number") {
            expect(tick).toBeCloseTo(expected_ticks[frame], 2);
            expect(gloop.get(CLOCK)).toBeCloseTo(
              frame <= 3 ? clock : paused_at,
            );
          }
          // cleanup after all expected frames
          else {
            gloop.stop();
            resolve();
          }
          frame += 1;
        });
        gloop.start();
        jest.advanceTimersByTime(7e3 / 201);
      });
    });

    test(`emits "${LOOP_PAINT}" event on 60 FPS interval`, async () => {
      jest.useFakeTimers({ now: new Date() });
      await new Promise((resolve, reject) => {
        let frame = 0;
        const expected_ticks = [0, 1 / 60, 1 / 60];
        gloop.on(LOOP_PAINT, ({ tick }) => {
          if (typeof expected_ticks[frame] === "number") {
            expect(tick).toBeCloseTo(expected_ticks[frame], 2);
          }
          // cleanup after all expected frames
          else {
            gloop.stop();
            resolve();
          }
          frame += 1;
        });
        gloop.start();
        jest.advanceTimersByTime(4e3 / 60);
      });
    });
  });

  describe("event: on/off/emit", () => {
    test(`use "on" to register event listener by type`, async () => {
      await new Promise((resolve, reject) => {
        const expected = "surge_bind";
        gloop.on(expected, ({ type }) => {
          expect(type).toBe(expected);
          resolve();
        });
        gloop.emit(expected);
      });
    });

    test(`use "on" to prepend event listener by type`, async () => {
      await new Promise((resolve, reject) => {
        const expected = "soul_cast";
        let actual_order = "";
        const expected_order = "|beta|alpha";
        // registered 1st, invoked 2nd
        gloop.on(expected, ({ type }) => {
          actual_order += "|alpha";
          expect(type).toBe(expected);
          expect(actual_order).toBe(expected_order);
          resolve();
        });
        // registered 2nd, invoked 1st
        gloop.on(
          expected,
          ({ type }) => {
            actual_order += "|beta";
            expect(type).toBe(expected);
            expect(actual_order).not.toBe(expected_order);
          },
          true,
        ); // 3rd arg is "prepend"
        gloop.emit(expected);
      });
    });

    test(`use "on" to register wildcard (${WILDCARD}) event listener for every event`, async () => {
      await new Promise((resolve, reject) => {
        const expected = "half_lash";
        gloop.on(WILDCARD, ({ type }) => {
          expect(type).toBe(expected);
          resolve();
        });
        gloop.emit(expected);
      });
    });

    test(`use "off" to deregister event listener by type + function`, async () => {
      await new Promise((resolve, reject) => {
        let sequence = "";
        const handler = ({ char }) => (sequence += char);
        gloop.on("handlerA", handler);
        gloop.on("assert", ({ str }) => expect(sequence).toBe(str));
        gloop.on("resolve", () => resolve());
        gloop.emit("handlerA", { char: "A" });
        gloop.emit("assert", { str: "A" });
        gloop.off("handlerA", handler); // removed
        gloop.emit("handlerA", { char: "A" });
        gloop.emit("assert", { str: "A" });
        gloop.emit("resolve");
      });
    });

    test(`use return from "on" to deregister event listener`, async () => {
      await new Promise((resolve, reject) => {
        let sequence = "";
        const handler = ({ char }) => (sequence += char);
        const remove = gloop.on("handlerA", handler);
        gloop.on("assert", ({ str }) => expect(sequence).toBe(str));
        gloop.on("resolve", () => resolve());
        gloop.emit("handlerA", { char: "A" });
        gloop.emit("assert", { str: "A" });
        remove(); // removed
        gloop.emit("handlerA", { char: "A" });
        gloop.emit("assert", { str: "A" });
        gloop.emit("resolve");
      });
    });

    test(`use "off" to deregister event listener by type`, async () => {
      await new Promise((resolve, reject) => {
        let sequence = "";
        const handler = ({ char }) => (sequence += char);
        gloop.on("handlerA", handler);
        gloop.on("assert", ({ str }) => expect(sequence).toBe(str));
        gloop.on("resolve", () => resolve());
        gloop.emit("handlerA", { char: "A" });
        gloop.emit("assert", { str: "A" });
        gloop.off("handlerA"); // removed
        gloop.emit("handlerA", { char: "A" });
        gloop.emit("assert", { str: "A" });
        gloop.emit("resolve");
      });
    });

    test(`calling "off" multiple ways/times is safe `, async () => {
      try {
        gloop.off("handlerA");
        gloop.off("handlerA");
        gloop.off();
        expect(true).toBe(true);
      } catch (ex) {
        expect(ex.message).toBe(null);
      }
    });
  });
});
