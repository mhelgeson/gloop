function makeGuid(prefix) {
  makeGuid.counter = makeGuid.counter || 1;
  return () => [
    // scope
    (prefix || "guid"),
    // obfuscation
    (~~performance.now()).toString(36),
    // uniqueness
    (makeGuid.counter++).toString(36)
  ].join("-");
}

export default makeGuid;
