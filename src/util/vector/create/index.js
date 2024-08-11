import assertNumber from "../../assertNumber";

const vectorCreate = (x = 0, y = 0) => {
  x = assertNumber(x, "vector/create[0]");
  y = assertNumber(y, "vector/create[1]");
  return { x, y };
};

export default vectorCreate;
