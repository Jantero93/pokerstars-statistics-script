const ncp = require('ncp').ncp;

const sourcePath = './.env';
const destinationPath = './dist/.env';

ncp(sourcePath, destinationPath, (err) => {
  if (err) {
    console.error(
      `Error on copying env file from ${sourcePath} to ${destinationPath}`
    );
  }
});
