import normalize from ".";
import length from "../length";

describe('vector/normalize', () => {
  it('should normalize the vector to a length of 1', () => {
    const vector = { x: 3, y: 4 };
    const result = normalize(vector);
    expect(length(result)).toBe(1);
    expect(result.x).toBeCloseTo(0.6);
    expect(result.y).toBeCloseTo(0.8);
  });

  it('should not modify a zero vector', () => {
    const vector = { x: 0, y: 0 };
    const result = normalize(vector);
    expect(length(result)).toBe(0);
    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
  });
});
