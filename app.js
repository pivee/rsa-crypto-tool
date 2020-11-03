const chalk = require('chalk');
const { Select } = require('enquirer');

class App {
  name = 'RSA Testing Tool';

  launch() {
    console.log(`Launching ${this.name} 🚀`);
    const testType = await this.selectEncryptionOrDecryption();
  }

  selectEncryptionOrDecryption() {
    const prompt = new Select({
      name: 'testType',
      message: 'Select Test Type',
      choices: [
        'Decryption',
        'Encryption',
      ]
    });
    return prompt.run()
      .then(answer => answer)
      .catch(console.error);
  }
}

module.exports = {
  App
};
