import create from "../create";
import isVector from "../isVector";

function fromScalar (value, name){
  if (isVector(value)){ // vector
    return value;
  }
  else if (Number.isFinite(value)){ // scalar
    return create(value, value);
  }
  else { // nope
    throw new Error(`InvalidValue in ${name}: ${value}`);
  }
}

export default fromScalar;
