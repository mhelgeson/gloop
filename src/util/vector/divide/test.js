import divide from ".";

describe("vector/divide", () => {
  it("should divide the current vector by the provided scalar and return new instance", () => {
    const vector = { x: 4, y: 6 };
    const result = divide(vector, 2);
    expect(result).not.toBe(vector);
    expect(result.x).toBe(2);
    expect(result.y).toBe(3);
  });

  it("should throw an error if the argument is not a number", () => {
    const vector = { x: 4, y: 6 };
    expect(() => divide(vector, "foo")).toThrowError("InvalidValue");
  });

  it("should throw an error if the argument is 0", () => {
    const vector = { x: 4, y: 6 };
    expect(() => divide(vector, 0)).toThrowError("CannotDivideByZero");
  });

  it("should divide by a 2D vector", () => {
    const vector = { x: 4, y: 6 };
    const result = divide(vector, { x: 2, y: 2 });
    expect(result).not.toBe(vector);
    expect(result.x).toBe(2);
    expect(result.y).toBe(3);
  });
});
