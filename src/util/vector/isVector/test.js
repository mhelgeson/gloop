import isVector from ".";

describe("vector/isVector", () => {
  const cases = [
    ["numeric string is not a vector", "123", false],
    ["alpha string is not a vector", "abc", false],
    ["boolean is not a vector", true, false],
    ["null is not a vector", null, false],
    ["undefined is not a vector", undefined, false],
    ["array is not a vector", [4, 2], false],
    ["number is not a vector", 123, false],
    ["empty object is not a vector", {}, false],
    ["object with only 'x' is not a vector", { x: 123 }, false],
    ["object with only 'y' is not a vector", { y: 123 }, false],
    [
      "object with non-numeric 'x' or 'y' is not a vector",
      { x: 1, y: "m" },
      false,
    ],
    ["object with numeric 'x' & 'y' is a vector", { x: 123, y: 456 }, true],
  ];
  test.each(cases)("%s", (desc, value, expected) => {
    const result = isVector(value);
    expect(result).toEqual(expected);
  });
});
