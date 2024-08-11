// convert color hsl components to rgb components
function hsl2rgb(hue, sat, lum) {
  // make args floats
  hue = hue / 360;
  sat = sat / 100;
  lum = lum / 100;
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
