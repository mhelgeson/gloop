import assertNumber from "./";

describe("assertNumber", () => {
  it("should return the number if it is valid", () => {
    expect(assertNumber(42)).toEqual(42);
    expect(assertNumber(3.14)).toBeCloseTo(3.14);
  });

  it("should throw an error if the input is NaN", () => {
    expect(() => assertNumber(NaN)).toThrowError("InvalidNumber");
  });

  it("should throw an error if the input is Infinity", () => {
    expect(() => assertNumber(Infinity)).toThrowError("InvalidNumber");
    expect(() => assertNumber(-Infinity)).toThrowError("InvalidNumber");
  });

  it("should fix floating point discrepancy", () => {
    expect(assertNumber(3.1456781234)).toBe(3.145678);
    expect(assertNumber(0.1 + 0.2)).toBe(0.3);
  });

  it("should use the provided name in the error message", () => {
    expect(() => assertNumber(NaN, "MyClass")).toThrowError(
      "InvalidNumber in MyClass (NaN)",
    );
  });
});
