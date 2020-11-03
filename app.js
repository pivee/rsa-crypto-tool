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
      this.testType = await this.selectEncryptionOrDecryption();
      switch (this.testType) {
        case 'Encryption':
          const customPublicKey = await this.inputCustomPublicKey();
          this.rsaService.useCustomPublicKey(customPublicKey);
          break;
        case 'Decryption':
          const customPrivateKey = await this.inputCustomPrivateKey();
          this.rsaService.useCustomPrivateKey(customPrivateKey);
          break;
        default:
          console.log('Something went wrong');
          process.exit();
      }
      this.main();
    } else {
      this.shouldUseDefaultKeys = await this.selectUseDefaultKeys();
      if (this.shouldUseDefaultKeys === 'No. Generate a new pair.') {
        const keySize = await this.selectKeySize();
        const encryptionScheme = await this.selectEncryptionScheme();
        const signingScheme = await this.selectSigningScheme();
        this.rsaService.generateKeyPair({ keySize, encryptionScheme, signingScheme });
        console.log('\nPublic Key:');
        console.log(this.rsaService.publicKey);
        console.log('\nPrivate Key:');
        console.log(this.rsaService.privateKey, '\n');
      }
      this.testType = await this.selectEncryptionOrDecryption();
      this.main();
    }
  }

  async main() {
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

  selectKeySize() {
    const io = new Select({
      name: 'keySize',
      message: 'Select a bit size for the keys.',
      choices: [
        '512',
        '1024',
        '2048',
        '4096',
      ]
    });
    return io.run()
      .then(answer => parseInt(answer))
      .catch(console.error);
  }

  selectEncryptionScheme() {
    const io = new Select({
      name: 'keyEncryptionScheme',
      message: 'Select Encryption Scheme.',
      choices: [
        'PKCS1 with OAEP',
        'PKCS1'
      ]
    });
    return io.run()
      .then(answer => {
        switch (answer) {
          case 'PKCS1 with OAEO':
            return 'pkcs1_oaep';
          case 'PKCS1':
            return 'pkcs1';
          default:
            return null;
        }
      })
      .catch(console.error);
  }

  selectSigningScheme() {
    const io = new Select({
      name: 'keySigningScheme',
      message: 'Select Signing Scheme.',
      choices: [
        'PKCS1-SHA256',
        'PSS-SHA1',
        'PSS-SHA256',
        'PSS-SHA512',
        'PSS-MD5',
      ]
    });
    return io.run()
      .then(answer => {
        switch (answer) {
          case 'PKCS1-SHA256':
            return 'pkcs1-sha256';
          case 'PSS-SHA1':
            return 'pss';
          case 'PSS-SHA256':
            return 'pss-sha256';
          case 'PSS-SHA512':
            return 'pss-sha512';
          case 'PSS-MD5':
            return 'pss-md5';
          default:
            return null;
        }
      })
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

  inputCustomPublicKey() {
    const io = new Input({
      message: `Enter the Public Key\n`,
      initial: ''
    });
    return io.run()
      .then(answer => answer)
      .catch(console.error);
  }

  inputCustomPrivateKey() {
    const io = new Input({
      message: `Enter the Private Key\n`,
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
