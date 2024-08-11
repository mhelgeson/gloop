import makeNoise from ".";

describe("util/makeNoise", () => {
  describe("out of range values", () => {
    let noise = makeNoise();
    test.each([
      [-1, -1, 0],
      [0, 0, 0],
      [0, 0, 0],
      [1, 1, 0],
      [2, 2, 0],
    ])("given (%s, %s) should return %s", (x, y, expected) => {
      expect(noise(x, y)).toBeCloseTo(expected);
    });
  });

  describe("in range values", () => {
    let noise = makeNoise({ seed: "reproducible" });
    test.each([
      [0.13, 0.13, 0.040792],
      [0.25, 0.25, 0.122022],
      [0.5, 0.5, -0.017075],
      [0.75, 0.75, -0.282034],
      // memoized...
      [0.13, 0.13, 0.040792],
      [0.25, 0.25, 0.122022],
      [0.5, 0.5, -0.017075],
      [0.75, 0.75, -0.282034],
    ])("given (%s, %s) should return %s", (x, y, expected) => {
      expect(noise(x, y)).toBeCloseTo(expected);
    });
  });

  describe("reproducible results", () => {
    let noise = makeNoise({ seed: "reproducible" });
    test.each([
      [0.13, 0.13, 0.040792],
      [0.25, 0.25, 0.122022],
      [0.5, 0.5, -0.017075],
      [0.75, 0.75, -0.282034],
    ])("given (%s, %s) should return %s", (x, y, expected) => {
      expect(noise(x, y)).toBeCloseTo(expected);
    });
  });
});
