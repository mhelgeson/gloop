import fromScalar from "../fromScalar";

const vectorDot = (a, b) => {
  a = fromScalar(a, "vector/dot[0]");
  b = fromScalar(b ?? a, "vector/dot[1]");
  return a.x * b.x + a.y * b.y;
};

export default vectorDot;
