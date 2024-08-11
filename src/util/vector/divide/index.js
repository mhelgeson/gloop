import create from "../create";
import fromScalar from "../fromScalar";

const vectorDivide = (a, b) => {
  a = fromScalar(a, "vector/divide[0]");
  b = fromScalar(b, "vector/divide[1]");
  return create(a.x / notZero(b.x), a.y / notZero(b.y));
};

const notZero = (value) => {
  if (value === 0) {
    throw new Error(`CannotDivideByZero in vectorDivide`);
  }
  return value;
};

export default vectorDivide;
