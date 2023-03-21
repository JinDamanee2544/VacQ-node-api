const mysql = require("mysql");

const connectSQL = mysql.createPool({
  host: "localhost",
  user: process.env.SQL_ROOT_USERNAME,
  password: process.env.SQL_ROOT_PASSWORD,
  database: process.env.SQL_DATABASE_NAME,
  port: 3306,
});

module.exports = connectSQL;
