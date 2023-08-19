const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const { initialiseDatabaseConnection } = require("./db/init");
const { logger } = require("./logs/logger_config");
const { chatbotRouter } = require("./chatbot");

const app = express();
const port = process.env.PORT || 2000;

const whitelist = ["http://localhost:3000", "http://dfglugjhgl.local:3000"];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || origin === undefined) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS origin ${origin}`));
    }
  },
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(express.json());
app.use(helmet());
app.use(cors(corsOptions));
app.use(logger.defaultLogger);
if (process.env.NODE_ENV !== "production") app.use(logger.devLogger);

app.disable("x-powered-by");

app.use("/api/v1", chatbotRouter);

app.use(logger.errorLogger);

async function main() {
  await initialiseDatabaseConnection();
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
    console.log(`NODE_ENV is: ${process.env.NODE_ENV}`);
  });
}

main();
