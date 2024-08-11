import create from "../create";
import fromScalar from "../fromScalar";

const vectorAdd = (a, b) => {
  a = fromScalar(a, "vector/add[0]");
  b = fromScalar(b, "vector/add[1]");
  return create(a.x + b.x, a.y + b.y);
};

export default vectorAdd
