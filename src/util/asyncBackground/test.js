import asyncBackground from "./index";

describe("util/asyncBackground", () => {
  describe("scope and dependencies", () => {
    it("should create a new private scope, preventing closures", async () => {
      const no_closure = 123;
      const task = asyncBackground(() => no_closure);
      try {
        const result = await task(); // expect to throw
        expect(result).toBe(no_closure); // expect to skip or fail
      } catch (ex) {
        expect(ex.message).toMatch("no_closure is not defined");
      }
    });

    it("dependency strings can be added to scope", async () => {
      const task = asyncBackground(() => dep, ["const dep = 123"]);
      const result = await task();
      expect(result).toBe(123);
    });

    it("dependencies can be functions (named declarations)", async () => {
      function dep() {
        return 123;
      }
      const task = asyncBackground(() => dep(), [dep]);
      const result = await task();
      expect(result).toBe(123);
    });
  });

  describe("errors and termination", () => {
    it("should terminate on uncaught errors", async () => {
      const task = asyncBackground(() => 19, ["throw new Error('ohno')"]);
      try {
        await task(); // expect to throw
        expect(true).toBe(false); // expect to fail
      } catch (ex) {
        expect(ex.message).toBe("ohno");
        await expect(task()).rejects.toMatchObject({
          message: "worker terminated",
        });
      }
    });

    it("should reject on thrown errors", async () => {
      const task = asyncBackground(() => {
        throw new Error("test");
      });
      try {
        await task();
        expect(true).toBe(false); // expect to fail
      } catch (ex) {
        expect(ex.message).toBe("test");
      }
    });

    it("should reject on rejected promises", async () => {
      const task = asyncBackground(() => Promise.reject("test"));
      try {
        await task();
        expect(true).toBe(false); // expect to fail
      } catch (ex) {
        expect(ex).toBe("test");
      }
    });

    it("should reject on rejected promises", async () => {
      const task = asyncBackground(() => 678);
      try {
        const result = await task();
        expect(result).toBe(678);
        await task("TERMINATE");
        await task(); // expect to throw
        expect(true).toBe(false); // expect to fail
      } catch (ex) {
        expect(ex).toMatchObject({ message: "worker terminated" });
      }
    });
  });

  describe("handle overlapping requests", () => {
    it("should handle overlapping requests", async () => {
      const task = asyncBackground((ms) => {
        return new Promise((resolve) => {
          setTimeout(() => resolve(ms), ms);
        });
      });
      const t1 = task(10);
      const t2 = task(5);
      const [r1, r2] = await Promise.all([t1, t2]);
      expect(r1).toBe(10);
      expect(r2).toBe(5);
    });
  });
});
