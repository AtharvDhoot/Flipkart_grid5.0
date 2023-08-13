const { Sequelize } = require("sequelize");

// const { dbConfig } = require("./config");

const dotenv = require("dotenv");
dotenv.config();

const SQL_DIALECT = process.env.SQL_DIALECT;

let sequelize;

if (!sequelize) {
  sequelize = new Sequelize({
    dialect: SQL_DIALECT,
    storage:
      "D:/NIIT/Sem 7/Hackathons/Flipkart grid 5.0/backend/storage/database.sqlite",
  });
  // sequelize = new Sequelize(
  //   dbConfig.database,
  //   dbConfig.username,
  //   dbConfig.password,
  //   {
  //     host: dbConfig.host,
  //     port: dbConfig.port,
  //     dialect: SQL_DIALECT,
  //   }
  // );
}

exports.sequelize = sequelize;
