const { sequelize } = require("./sequelize");

// const { initModels } = require("../models/init-models");

async function initialiseDatabaseConnection() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }

  try {
    // initModels(sequelize);
    await sequelize.sync();
    console.log("Successfully synced to the database");
  } catch (error) {
    console.error("Unable to sync to the database:", error);
  }
}

exports.initialiseDatabaseConnection = initialiseDatabaseConnection;
