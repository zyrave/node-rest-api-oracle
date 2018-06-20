const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  env: process.env.NODE_ENV || 'Development',
  server: {
    port: process.env.HTTP_PORT || 5000,
  },
  db: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectionString: process.env.DB_CONNECTION_STRING,
    poolMin: 10,
    poolMax: 10,
    poolIncrement: 0,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiration: process.env.JWT_EXPIRATION || 10000,
  },
};
