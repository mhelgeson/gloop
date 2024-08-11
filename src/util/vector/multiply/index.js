import create from "../create";
import fromScalar from "../fromScalar";

const vectorMultiply = (a, b) => {
  a = fromScalar(a, "vector/multiply[0]");
  b = fromScalar(b, "vector/multiply[1]");
  return create(a.x * b.x, a.y * b.y);
};

export default vectorMultiply
