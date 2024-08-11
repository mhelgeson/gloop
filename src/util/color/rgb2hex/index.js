import assertNumber from "../../assertNumber";

function rgb2hex(...args) {
  const r = assertNumber(args[0], "rgb2hex[0]");
  const g = assertNumber(args[1], "rgb2hex[1]");
  const b = assertNumber(args[2], "rgb2hex[2]");
  const hex = (val) => ("0" + val.toString(16)).substr(-2);
  return `#${hex(r)}${hex(g)}${hex(b)}`.toUpperCase();
}

export default rgb2hex;
