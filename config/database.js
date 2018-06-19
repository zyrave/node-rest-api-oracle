module.exports = {
  hrPool: {
    user: process.env.HR_USER || 'hr',
    password: process.env.HR_PASSWORD || 'oracle',
    connectionString: process.env.HR_CONNECTIONSTRING || 'localhost:1521/xe',
    poolMin: 10,
    poolMax: 10,
    poolIncrement: 0,
  },
};
