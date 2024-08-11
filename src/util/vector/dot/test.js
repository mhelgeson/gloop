import dot from ".";

describe("vector/dot", () => {
  it("should calculate the dot product of two vectors", () => {
    const vector1 = { x: 1, y: 2 };
    const vector2 = { x: 4, y: 5 };
    const dotProduct = dot(vector1, vector2);
    expect(dotProduct).toBe(14);
  });

  it("should calculate the dot product of a vector with itself", () => {
    const vector = { x: 1, y: 2 };
    const dotProduct = dot(vector);
    expect(dotProduct).toBe(5);
  });
});
