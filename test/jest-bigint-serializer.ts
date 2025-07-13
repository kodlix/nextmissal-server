module.exports = {
  serialize(val, config, indentation, depth, refs, printer) {
    return `${val.toString()}n`;
  },
  test(val) {
    return typeof val === 'bigint';
  },
};
