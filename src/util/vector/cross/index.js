import fromScalar from "../fromScalar";

const vectorCross = (a, b) => {
  a = fromScalar(a, "vector/cross[0]");
  b = fromScalar(b ?? a, "vector/cross[1]");
  return a.x * b.y - a.y * b.x;
};

export default vectorCross;
