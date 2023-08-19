async function initialiseDatabaseConnection() {
  try {
    console.log("Successfully synced to the database");
  } catch (error) {
    console.error("Unable to sync to the database:", error);
  }
}

exports.initialiseDatabaseConnection = initialiseDatabaseConnection;
