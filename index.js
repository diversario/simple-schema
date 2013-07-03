module.exports = process.env.SIMPLE_SCHEMA_COV
  ? require('./lib-cov/')
  : require('./lib/');
