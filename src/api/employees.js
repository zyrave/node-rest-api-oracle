const oracledb = require('oracledb');

const database = require('../services/database');

exports.find = async function find(context) {
  const binds = {};

  let query = `SELECT employee_id "id",
      first_name "first_name",
      last_name "last_name",
      email "email",
      phone_number "phone_number",
      hire_date "hire_date",
      job_id "job_id",
      salary "salary",
      commission_pct "commission_pct",
      manager_id "manager_id",
      department_id "department_id"
    FROM employees`;

  if (context.id) {
    binds.employee_id = context.id;
    query += `\nWHERE employee_id = :employee_id`;
  }

  const result = await database.simpleExecute(query, binds);

  return result.rows;
};

exports.create = async function create(emp) {
  const employee = Object.assign({}, emp);

  employee.employee_id = {
    dir: oracledb.BIND_OUT,
    type: oracledb.NUMBER,
  };

  const createSql = `INSERT INTO employees (
      first_name,
      last_name,
      email,
      phone_number,
      hire_date,
      job_id,
      salary,
      commission_pct,
      manager_id,
      department_id
    ) VALUES (
      :first_name,
      :last_name,
      :email,
      :phone_number,
      to_date(:hire_date,'YYYY-MM-DD'),
      :job_id,
      :salary,
      :commission_pct,
      :manager_id,
      :department_id
    ) RETURNING employee_id
    INTO :employee_id`;

  const result = await database.simpleExecute(createSql, employee);

  employee.employee_id = result.outBinds.employee_id[0]; // eslint-disable-line

  return employee;
};

exports.update = async function update(emp) {
  const employee = Object.assign({}, emp);

  const updateSql = `UPDATE employees
    SET first_name = :first_name,
      last_name = :last_name,
      email = :email,
      phone_number = :phone_number,
      hire_date = to_date(:hire_date,'YYYY-MM-DD'),
      job_id = :job_id,
      salary = :salary,
      commission_pct = :commission_pct,
      manager_id = :manager_id,
      department_id = :department_id
    WHERE employee_id = :employee_id`;

  const result = await database.simpleExecute(updateSql, employee);

  if (result.rowsAffected && result.rowsAffected === 1) {
    return employee;
  }

  return null;
};

exports.delete = async function del(id) {
  const binds = {
    employee_id: id,
    rowcount: {
      dir: oracledb.BIND_OUT,
      type: oracledb.NUMBER,
    },
  };

  const deleteSql = `BEGIN

      DELETE FROM job_history
      WHERE employee_id = :employee_id;

      DELETE FROM employees
      WHERE employee_id = :employee_id;

      :rowcount := SQL%ROWCOUNT;

    END;`;

  const result = await database.simpleExecute(deleteSql, binds);

  return result.outBinds.rowcount === 1;
};
