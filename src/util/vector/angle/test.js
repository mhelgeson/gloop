import angle from ".";

describe("vector/angle", () => {
  it("should get the angle of the vector in radians", () => {
    const vector = { x: 1, y: 0 };
    expect(angle(vector)).toBe(Math.PI / 2);

    const vector2 = { x: 0, y: 1 };
    expect(angle(vector2)).toBe(0);

    const vector3 = { x: -1, y: 0 };
    expect(angle(vector3)).toBe(Math.PI / -2);

    const vector4 = { x: 0, y: -1 };
    expect(angle(vector4)).toBe(Math.PI);
  });

  it("should set the angle of the vector in a new instance", () => {
    const vector = { x: 1, y: 0 };
    const result = angle(vector, Math.PI / 4);
    expect(result).not.toBe(vector);
    expect(result.x).toBeCloseTo(Math.sqrt(2) / 2);
    expect(result.y).toBeCloseTo(Math.sqrt(2) / 2);
  });
});
