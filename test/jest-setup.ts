expect.addSnapshotSerializer({
  test: val => typeof val === 'bigint',
  serialize: (val, config, indentation, depth, refs, printer) => `${val.toString()}n`, // Append 'n' to BigInts for clarity
});

// Global BigInt serialization for JSON.stringify
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};
