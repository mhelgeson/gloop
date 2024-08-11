// ensure valid number values
function assertNumber(n, name="Class") {
  if (Number.isFinite(n)) {
    // fix floating point discrepancy
    return Math.round(n * 1e6) / 1e6;
  }
  throw new Error(`InvalidNumber in ${name} (${n})`);
}

export default assertNumber;
