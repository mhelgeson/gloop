import rgb2hex from "./index";

describe("color/rgb2hex", () => {
  test.each([
    [[0, 0, 0], "#000000"],
    [[255, 0, 0], "#FF0000"],
    [[0, 255, 0], "#00FF00"],
    [[0, 0, 255], "#0000FF"],
  ])("given (%s) should return %s", (rgb, expected) => {
    expect(rgb2hex(...rgb)).toStrictEqual(expected);
  });

  test.each([[["a", "b", "c"]], [[true, 100, 50]], [[{}, [], ""]], [[1]]])(
    "given (%s) should throw InvalidNumber",
    (rgb) => {
      expect(() => rgb2hex(...rgb)).toThrow("InvalidNumber");
    },
  );
});
