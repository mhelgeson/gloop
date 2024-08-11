import rgb2str from "./index";

describe("color/rgb2str", () => {
  test.each([
    [[0, 0, 0], "rgb(0,0,0)"],
    [[255, 0, 0], "rgb(255,0,0)"],
    [[0, 255, 0], "rgb(0,255,0)"],
    [[0, 0, 255], "rgb(0,0,255)"],
  ])("given (%s) should return %s", (rgb, expected) => {
    expect(rgb2str(...rgb)).toStrictEqual(expected);
  });

  test.each([[["a", "b", "c"]], [[true, 100, 50]], [[{}, [], ""]], [[1]]])(
    "given (%s) should throw InvalidNumber",
    (rgb) => {
      expect(() => rgb2str(...rgb)).toThrow("InvalidNumber");
    },
  );
});
