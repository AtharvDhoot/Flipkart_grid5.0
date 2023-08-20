const fs = require("fs");

function writeObjectToFile(filePath, object) {
  const data = JSON.stringify(object, null, 2);
  fs.writeFileSync(filePath, data, "utf8");
}

function readObjectFromFile(filePath) {
  const data = fs.readFileSync(filePath, "utf8");
  const object = JSON.parse(data);
  return object;
}

exports.writeObjectToFile = writeObjectToFile;
exports.readObjectFromFile = readObjectFromFile;
