import create from "../create";
import fromScalar from "../fromScalar";
import assertNumber from "../../assertNumber";

const vectorAngle = (a, rad) => {
  // getter...
  a = fromScalar(a, "vector/angle[0]");
  if (typeof rad === "undefined") {
    return Math.atan2(a.x, a.y);
  }
  // setter...
  rad = assertNumber(rad, "vector/angle[1]");
  const len = Math.sqrt(a.x ** 2 + a.y ** 2); // length
  return create(Math.sin(rad) * len, Math.cos(rad) * len);
};

export default vectorAngle;
