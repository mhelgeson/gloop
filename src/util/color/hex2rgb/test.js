import hex2rgb from "./index";

describe("color/hex2rgb", () => {
  test.each([
    [" #111 ", [17, 17, 17]],
    ["#000", [0, 0, 0]],
    ["#FFF", [255, 255, 255]],
    ["#F00", [255, 0, 0]],
    ["#0F0", [0, 255, 0]],
    ["#00F", [0, 0, 255]],
    ["#137", [17, 51, 119]],
    ["#DF73FF", [223, 115, 255]],
    ["#C0FFEE", [192, 255, 238]],
    ["#BADA55", [186, 218, 85]],
    ["#40826D", [64, 130, 109]],
    [" #082567 ", [8, 37, 103]],
  ])("given (%s) should return %s", (hex, expected) => {
    expect(hex2rgb(hex)).toStrictEqual(expected);
  });

  test.each([
    ["000"],
    ["#1234"],
    ["##000"],
    ["#COFFEE"],
    ["#abcdefg"],
    ["#123456789"],
    ["# 12345"],
    ["123"],
    ["#XYZ123"],
    [[1, 2, 3]],
    [123456],
    [true],
    [{}],
  ])("given (%s) should throw InvalidColor", (hex) => {
    expect(() => hex2rgb(hex)).toThrow("InvalidColor");
  });
});
