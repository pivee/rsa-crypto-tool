const fs = require('fs');
const { App } = require('./app');

const initializers = new Promise((resolve, reject) => {
  if (!fs.existsSync('./exports')) fs.mkdirSync('./exports');
  if (!fs.existsSync('./exports/keys')) fs.mkdirSync('./exports/keys');
  if (!fs.existsSync('./exports/logs')) fs.mkdirSync('./exports/logs');
  resolve();
});

initializers.then(
  () => {
    const app = new App();
    app.launch();
  }
);
