import makeGuid from "./index";

describe("util/makeGuid", () => {
  it("should use default prefix to create guids", () => {
    const guid = makeGuid();
    const pattern = /^guid-[a-z0-9]+-[a-z0-9]+$/;
    const id1 = guid();
    expect(id1).toMatch(pattern);
    const id2 = guid();
    expect(id2).toMatch(pattern);
    expect(id1).not.toEqual(id2);
  });

  it("should use custom prefix to create guids", () => {
    const guid = makeGuid("abc");
    const pattern = /^abc-[a-z0-9]+-[a-z0-9]+$/;
    const id1 = guid();
    expect(id1).toMatch(pattern);
    const id2 = guid();
    expect(id2).toMatch(pattern);
    expect(id1).not.toEqual(id2);
  });

  it("should always create unique guids, even with duplicate factories", () => {
    const lookup = new Set();
    for (let i = 0; i < 100; i++) {
      const id = makeGuid()();
      expect(lookup.has(id)).toEqual(false);
      lookup.add(id);
    }
  });
});
