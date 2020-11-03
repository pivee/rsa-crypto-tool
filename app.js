const chalk = require('chalk');
const { Toggle, Input, Select } = require('enquirer');
const { NodeRSAService } = require('./services/node-rsa.service');

class App {
  name = 'RSA Testing Tool';
  rsaService = new NodeRSAService({ useExistingKeyPair: true });
  hasCustomKeys = false;
  shouldUseDefaultKeys = true;
  testType = 'Encryption';
  testString = '';


  async launch() {
    console.log(chalk.yellow(`Launching ${this.name}... 🚀🚀🚀\n`));
    this.hasCustomKeys = await this.toggleHaveKeys();
    if (this.hasCustomKeys) {
      console.log('What? You do???');
      process.exit();
    } else {
      this.shouldUseDefaultKeys = await this.selectUseDefaultKeys();
    }
    if (this.shouldUseDefaultKeys === 'No. Generate a new pair.') {
      this.rsaService.generateKeyPair();
      console.log('\nPublic Key:');
      console.log(this.rsaService.publicKey);
      console.log('\nPrivate Key:');
      console.log(this.rsaService.privateKey, '\n');
    }
    this.testType = await this.selectEncryptionOrDecryption();
    switch (this.testType) {
      case 'Encryption':
        this.testString = await this.inputTestString('encrypt');
        const cipher = this.rsaService.encrypt(this.testString);
        console.log(chalk.yellow(cipher));
        break;
      case 'Decryption':
        this.testString = await this.inputTestString('decrypt');
        const plainText = this.rsaService.decrypt(this.testString);
        console.log(chalk.blue(plainText));
        break;
      default:
        console.log('Something went wrong');
        process.exit();
    }
  }

  toggleHaveKeys() {
    const io = new Toggle({
      message: 'Do you have custom a key pair?',
      enabled: 'Yes',
      disabled: 'No',
    });
    return io.run()
      .then(answer => answer)
      .catch(console.error);
  }

  selectEncryptionOrDecryption() {
    const io = new Select({
      name: 'testType',
      message: 'Select Test Type',
      choices: [
        'Decryption',
        'Encryption',
      ]
    });
    return io.run()
      .then(answer => answer)
      .catch(console.error);
  }

  selectUseDefaultKeys() {
    const io = new Select({
      name: 'keyType',
      message: 'Do you want to use the default keys?',
      choices: [
        'Yes. Use the default keys.',
        'No. Generate a new pair.'
      ]
    });
    return io.run()
      .then(answer => answer)
      .catch(console.error);
  }

  inputTestString(cryptoFunction) {
    const io = new Input({
      message: `Enter the string to ${cryptoFunction}\n`,
      initial: ''
    });
    return io.run()
      .then(answer => answer)
      .catch(console.error);
  }
}

module.exports = {
  App
};
