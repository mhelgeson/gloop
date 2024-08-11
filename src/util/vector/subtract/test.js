import subtract from ".";

describe('vector/subtract', () => {
  it('should subtract the provided vector from the current vector and return new instance', () => {
    const vector1 = { x: 2, y: 3 };
    const vector2 = { x: 4, y: 5 };
    const result = subtract(vector1, vector2);
    expect(vector1.x).toBe(2);
    expect(vector1.y).toBe(3);
    expect(vector2.x).toBe(4);
    expect(vector2.y).toBe(5);
    expect(result).not.toBe(vector1);
    expect(result.x).toBe(-2);
    expect(result.y).toBe(-2);
  });

  it('should subtract the provided number from the current vector and return new instance', () => {
    const vector = { x: 2, y: 3 };
    const result = subtract(vector, 4);
    expect(result).not.toBe(vector);
    expect(result.x).toBe(-2);
    expect(result.y).toBe(-1);
  });

  it('should subtract the provided object with x and y properties from the current vector and return new instance', () => {
    const vector = { x: 2, y: 3 };
    const result = subtract(vector, { x: 0, y: 5 });
    expect(result).not.toBe(vector);
    expect(result.x).toBe(2);
    expect(result.y).toBe(-2);
  });

  it('should throw an error if the argument is not a number or object', () => {
    const vector = { x: 2, y: 3 };
    expect(() => subtract(vector, 'foo')).toThrowError('InvalidValue');
  });
});
