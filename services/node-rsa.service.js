const NodeRSA = require('node-rsa');
const fs = require('fs');
const { parseTimestampForFileName } = require('../helpers/parseTimestampForFileName.helper');

class NodeRSAService {
  publicKey = '';
  privateKey = '';

  constructor({ useExistingKeyPair = false } = {}) {
    if (useExistingKeyPair) {
      this.useExistingKeyPair();
    } else {
      this.generateKeyPair();
    }
  }

  generateKeyPair({ keySize = 1024, encryptionScheme = 'pkcs1_oaep', signingScheme = 'pkcs1-sha256' } = {}) {
    this.rsa = new NodeRSA({ b: keySize }, { encryptionScheme: encryptionScheme });
    this.publicKey = this.rsa.exportKey('pkcs1-public-pem');
    this.privateKey = this.rsa.exportKey('pkcs1-private-pem');
  }

  useExistingKeyPair() {
    this.publicKey = fs.readFileSync('./data/keys/public-key.pem', { encoding: 'utf8' });
    this.privateKey = fs.readFileSync('./data/keys/private-key.pem', { encoding: 'utf8' });
  }

  encrypt(plainText) {
    const rsa = new NodeRSA(this.publicKey);
    const cipher = rsa.encrypt(plainText, 'base64');
    const directory = './data/ciphers/';
    const fileName = parseTimestampForFileName(new Date()) + '.txt';
    if (!fs.existsSync(directory)) fs.mkdirSync(directory);
    fs.writeFile(`${directory}${fileName}`, cipher, (err) => {
      if (err) throw err;
      console.log('Created new Cipher');
    });
    return cipher;
  }

  decrypt(cipher) {
    const rsa = new NodeRSA(this.privateKey);
    const plainText = rsa.decrypt(cipher);
    const directory = './data/sources/';
    const fileName = parseTimestampForFileName(new Date()) + '.txt';
    if (!fs.existsSync(directory)) fs.mkdirSync(directory);
    fs.writeFile(`${directory}${fileName}`, plainText, (err) => {
      if (err) throw err;
      console.log('Cipher decrypted successfully');
    });
    return plainText;
  }

}

module.exports = { NodeRSAService };
