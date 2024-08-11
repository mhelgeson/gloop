import hsl2rgb from "./index";

describe("color/hsl2rgb", () => {
  test.each([
    [
      [0, 100, 50],
      [255, 0, 0],
    ],
    [
      [420, 100, 0],
      [0, 0, 0],
    ],
    [
      [369, 100, 100],
      [255, 255, 255],
    ],
    [
      [120, 0, 50],
      [128, 128, 128],
    ],
    [
      [120, 75, 25],
      [16, 112, 16],
    ],
    [
      [300, 100, 50],
      [255, 0, 255],
    ],
    [
      [450, 100, 50],
      [128, 255, 0],
    ],
  ])("given (%s) should return %s", (hsl, expected) => {
    expect(hsl2rgb(...hsl)).toStrictEqual(expected);
  });

  test.each([
    [["240", "100", "50"]],
    [["a", "b", "c"]],
    [[true, 100, 50]],
    [[{}, [], ""]],
    [[1]],
  ])("given (%s) should throw InvalidNumber", (hsl) => {
    expect(() => hsl2rgb(...hsl)).toThrow("InvalidNumber");
  });
});
