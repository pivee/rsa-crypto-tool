const fs = require('fs');
const { App } = require('./app');

const initializers = new Promise((resolve, reject) => {
  if (!fs.existsSync('./exports')) fs.mkdirSync('./exports');
  resolve();
});

initializers.then(
  () => {
    const app = new App();
    app.launch();
  }
);
