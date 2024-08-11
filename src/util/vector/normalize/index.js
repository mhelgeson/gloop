import divide from '../divide';
import fromScalar from '../fromScalar';

const vectorNormalize = (a) => {
  a = fromScalar(a, "vector/normalize[0]");
  const len = Math.sqrt(a.x ** 2 + a.y ** 2);
  return len ? divide(a, len) : a;
};

export default vectorNormalize;
