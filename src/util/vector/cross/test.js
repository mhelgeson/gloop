import cross from ".";

describe('vector/cross', () => {
  it('should calculate the cross product of two vectors', () => {
    const vector1 = { x: 1, y: 2 };
    const vector2 = { x: 4, y: 5 };
    const result = cross(vector1, vector2);
    expect(result).toBe(-3);
  });

  it('should calculate the cross product of a vector with itself', () => {
    const vector = { x: 1, y: 2 };
    const result = cross(vector);
    expect(result).toBe(0);
  });
});
