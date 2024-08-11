import assertNumber from "../../assertNumber";

// convert color hsl components to rgb components
function hsl2rgb(...args) {
  // make args floats
  const hue = assertNumber(args[0], "hsl2rgb[0]") / 360;
  const sat = assertNumber(args[1], "hsl2rgb[1]") / 100;
  const lum = assertNumber(args[2], "hsl2rgb[2]") / 100;
  // calculate
  const x = lum < 0.5 ? lum * (1 + sat) : lum + sat - sat * lum;
  const y = 2 * lum - x;
  const hue2rgb = (h) => {
    h += h < 0 ? +1 : h > 1 ? -1 : 0;
    h =
      6 * h < 1
        ? y + (x - y) * 6 * h
        : 2 * h < 1
          ? x
          : 3 * h < 2
            ? y + (x - y) * (2 / 3 - h) * 6
            : y;
    return Math.ceil(255 * h);
  };
  return [hue2rgb(hue + 1 / 3), hue2rgb(hue), hue2rgb(hue - 1 / 3)];
}

export default hsl2rgb;
