import length from ".";

describe("vector/length", () => {
  it("should get the length of the vector", () => {
    const vector = { x: 3, y: 4 };
    expect(length(vector)).toBe(5);
  });

  it("should set the length of the vector and update the x and y values", () => {
    const vector = { x: 3, y: 4 };
    const result = length(vector, 10);
    expect(result).not.toBe(vector);
    expect(result.x).toBeCloseTo(6);
    expect(result.y).toBeCloseTo(8);
  });
});
