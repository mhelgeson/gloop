import assertNumber from "../../assertNumber";

function rgb2str(...args) {
  const r = assertNumber(args[0], "rgb2str[0]");
  const g = assertNumber(args[1], "rgb2str[1]");
  const b = assertNumber(args[2], "rgb2str[2]");
  return `rgb(${r},${g},${b})`;
}

export default rgb2str;
