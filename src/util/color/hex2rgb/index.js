const SHORT = /^#([\da-f]{1})([\da-f]{1})([\da-f]{1})$/i;
const FULL = /^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i;

function hex2rgb(hex) {
  // expand hexadecimal shorthand
  const [short, r, g, b] = SHORT.exec(hex) || [];
  if (short) {
    hex = `#${r}${r}${g}${g}${b}${b}`;
  }
  // parse hexadecimal into components
  const [long, rr, gg, bb] = FULL.exec(hex) || [];
  if (long) {
    return [parseInt(rr, 16), parseInt(gg, 16), parseInt(bb, 16)];
  }
  // bad input
  else {
    throw Error(`InvalidColor (hex2rgb): ${hex}`);
  }
}
