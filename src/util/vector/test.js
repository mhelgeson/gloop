import vector from '.';

describe('util/vector - optional static interface', () => {
  test.each([
    ["add"],
    ["angle"],
    ["create"],
    ["cross"],
    ["divide"],
    ["dot"],
    ["fromScalar"],
    ["isVector"],
    ["length"],
    ["multiply"],
    ["normalize"],
    ["subtract"],
  ])("vector.%s() exists", (method) => {
    expect(vector[method]).toBeDefined();
  });
});
