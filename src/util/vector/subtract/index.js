import create from "../create";
import fromScalar from "../fromScalar";

const vectorSubtract = (a, b) => {
  a = fromScalar(a, "vector/subtract[0]");
  b = fromScalar(b, "vector/subtract[1]");
  return create(a.x - b.x, a.y - b.y);
};

export default vectorSubtract;
