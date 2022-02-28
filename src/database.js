const mysql = require("mysql");
const { promisify } = require("util");
const { database } = require("./keys");

const dbpool = mysql.createPool(database);

dbpool.getConnection((err, connection) => {
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("DATABASE    : CONECTION CLOSED");
    }
    if (err.code === "ER_CON_COUNT_ERROR") {
      console.error("DATABASE    : TO MANY CONNECTIONS");
    }
    if (err.code === "ECONNREFUSED") {
      console.error("DATABASE    : CONECTION REFUSED");
    }
    if ((err.code === "ER_ACCESS_DENIED_NO_PASSWORD_ERROR") || (err.code === "ER_ACCESS_DENIED_ERROR")) {
      console.error("DATABASE    : WRONG USER/PASSWORD");
    }
    if (err.code === "ENOTFOUND") {
      console.error("DATABASE    : WRONG HOST. CHECK HOST ADDRESS");
    }
    if (err.code === "ER_BAD_DB_ERROR") {
      console.error("DATABASE    : NOT FOUND. CHECK DB NAME");
    }
  }
  if (connection){
   connection.release();
   console.log("DATABASE    : CONNECTION OK");
  }
  return;
});

// Turn callbacks into promises
dbpool.query = promisify(dbpool.query);

module.exports = dbpool;
