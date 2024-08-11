import { jest } from "@jest/globals";
import loop from "../loop";

describe("util/loop", () => {
  test("setTimeout", async () => {
    jest.useFakeTimers({ now: new Date() });
    const time = 1e3 / 200; // timeout interval
    await new Promise((resolve, reject) => {
      let frame = 0;
      loop((sec) => {
        expect(typeof sec).toBe("number");
        expect(sec).toBeCloseTo(frame ? 1 / 200 : 0);
        // end after 10 frames
        if (++frame >= 10) {
          resolve();
          return false;
        }
      }, time);
      jest.advanceTimersByTime(10e3 / 200);
    });
  });

  test("requestAnimationFrame", async () => {
    jest.useFakeTimers({ now: new Date() });
    const time = null; // request animation frame
    await new Promise((resolve, reject) => {
      let frame = 0;
      loop((sec) => {
        expect(typeof sec).toBe("number");
        expect(sec).toBeCloseTo(frame ? 1 / 60 : 0);
        // end after 10 frames
        if (++frame >= 10) {
          resolve();
          return false;
        }
      }, time);
      jest.advanceTimersByTime(10e3 / 60);
    });
  });
});
