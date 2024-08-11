import create from ".";

describe("vector/create", () => {
  it("should create a new Vector instance with the provided x and y values", () => {
    const vector = create(2, 3);
    expect(vector.x).toBe(2);
    expect(vector.y).toBe(3);
  });

  it("should create a new Vector instance with default values of 0 if none are provided", () => {
    const vector = create();
    expect(vector.x).toBe(0);
    expect(vector.y).toBe(0);
  });

  it("should throw an error if x is not a number", () => {
    expect(() => create("foo", 3)).toThrowError("InvalidNumber");
  });

  it("should throw an error if y is not a number", () => {
    expect(() => create(2, "bar")).toThrowError("InvalidNumber");
  });

  it("should throw an error if given infinity", () => {
    expect(() => create(2, Infinity)).toThrowError("InvalidNumber");
  });
});
