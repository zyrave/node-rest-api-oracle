const oracledb = require('oracledb');

const config = require('../config');

exports.initialize = async function initialize() {
  await oracledb.createPool(config.db);
};

exports.close = async function close() {
  await oracledb.getPool().close();
};

exports.simpleExecute = function simpleExecute(statement, binds = [], opts = {}) {
  return new Promise(async (resolve, reject) => {
    let conn;

    opts.outFormat = oracledb.OBJECT;
    opts.autoCommit = true;

    try {
      conn = await oracledb.getConnection();
      const result = await conn.execute(statement, binds, opts);
      resolve(result);
    } catch (err) {
      reject(err);
    } finally {
      if (conn) {
        // conn assignment worked, need to close
        try {
          await conn.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
  });
};
