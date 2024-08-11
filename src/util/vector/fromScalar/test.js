import fromScalar from ".";

describe('vector/fromScalar', () => {
  it('should create a vector from a scalar value', () => {
    const result = fromScalar(3);
    expect(result).toStrictEqual({ x:3, y:3 });
  });
  it('should preserve a vector value', () => {
    const vector = { x:7, y:3 };
    const result = fromScalar(vector);
    expect(result.x).toBe(vector.x);
    expect(result.y).toBe(vector.y);
  });
  const cases = [
    ['InvalidValue', NaN],
    ['InvalidValue', Infinity],
    ['InvalidValue', -Infinity],
  ];
  test.each(cases)('should throw %s if given a %s', (err, value) => {
    expect(() => fromScalar(value, "fromScaler")).toThrowError(err);
  });
});
