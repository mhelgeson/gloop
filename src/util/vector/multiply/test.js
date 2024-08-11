import multiply from ".";

describe('vector/multiply', () => {
  it('should multiply the current vector by the provided scalar and return new instance', () => {
    const vector = { x: 2, y: 3 };
    const result = multiply(vector, 2);
    expect(result).not.toBe(vector);
    expect(result.x).toBe(4);
    expect(result.y).toBe(6);
  });

  it('should throw an error if the argument is not a number', () => {
    const vector = { x: 2, y: 3 };
    expect(() => multiply(vector, 'foo')).toThrowError('InvalidValue');
  });
});
