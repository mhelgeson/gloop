import create from "../create";
import fromScalar from "../fromScalar";
import assertNumber from "../../assertNumber";

const vectorLength = (a, len) => {
  // getter...
  a = fromScalar(a, "vector/length[0]");
  if (typeof len === "undefined"){
    return Math.sqrt(a.x ** 2 + a.y ** 2);
  }
  // setter...
  len = assertNumber(len, "vector/length[1]");
  const rad = Math.atan2(a.x, a.y); // angle
  return create(Math.sin(rad) * len, Math.cos(rad) * len);
};

export default vectorLength;
