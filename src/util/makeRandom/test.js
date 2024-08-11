import makeRandom from "./index";

describe("util/makeRandom", () => {
  describe("random", () => {
    it("should generate a random integer between 0 and 99", () => {
      const random = makeRandom("myseed");
      const num = random();
      expect(num).toBeGreaterThanOrEqual(0);
      expect(num).toBeLessThan(100);
    });

    it("should generate a random integer between 10 and 20", () => {
      const random = makeRandom("myseed");
      const num = random(20, 10);
      expect(num).toBeGreaterThanOrEqual(10);
      expect(num).toBeLessThan(21);
    });

    it("should generate the same sequence of numbers with the same seed", () => {
      const random1 = makeRandom("myseed");
      const num1 = random1();
      const random2 = makeRandom("myseed");
      const num2 = random2();
      expect(num1).toEqual(num2);
    });

    it("should generate a different sequence of numbers with the no seed", () => {
      const random1 = makeRandom();
      const num1 = random1();
      const random2 = makeRandom();
      const num2 = random2();
      expect(num1).not.toEqual(num2);
    });
  });
});
