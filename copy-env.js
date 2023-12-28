const ncp = require('ncp').ncp;
const fs = require('fs');
const path = require('path');

const sourcePath = './.env';
const destinationPath = './dist/.env';

const checkEnvFileExists = () => {
  const filename = '.env';
  const filepath = path.join(__dirname, filename);

  let fileExists = false;

  fs.access(filepath, fs.constants.F_OK, (err) => (fileExists = !!err));

  return fileExists;
};

ncp(sourcePath, destinationPath, (err) => {
  if (err && checkEnvFileExists()) {
    console.warn(err);
  }
});
