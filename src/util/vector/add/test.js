import add from '.';

describe('vector/add', () => {
  it('should add the provided vector to the current vector and return new instance', () => {
    const vector1 = { x:2, y:3 };
    const vector2 = { x:4, y:5 };
    const result = add(vector1, vector2);
    expect(vector1.x).toBe(2);
    expect(vector1.y).toBe(3);
    expect(vector2.x).toBe(4);
    expect(vector2.y).toBe(5);
    expect(result).not.toBe(vector1);
    expect(result.x).toBe(6);
    expect(result.y).toBe(8);
  });

  it('should add the provided number to the current vector and return new instance', () => {
    const vector = { x:2, y:3 };
    const result = add(vector, 4);
    expect(result).not.toBe(vector);
    expect(result.x).toBe(6);
    expect(result.y).toBe(7);
  });

  it('should add the provided object with x and y properties to the current vector and return new instance', () => {
    const vector = { x:1, y:2 };
    const result = add(vector, { x:1, y:5 });
    expect(result).not.toBe(vector);
    expect(result.x).toBe(2);
    expect(result.y).toBe(7);
  });

  it('should throw an error if the argument is not a number or object', () => {
    const vector = { x:2, y:3 };
    expect(() => add(vector, "abc")).toThrowError('InvalidValue');
  });
});
