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
    const directory = `./exports/keys/${parseTimestampForFileName(new Date())}/`;
    const fileNamePublic = 'public-key';
    const fileNamePrivate = 'private-key';
    if (!fs.existsSync(directory)) fs.mkdirSync(directory);
    fs.writeFile(`${directory}options.json`, JSON.stringify({ keySize, encryptionScheme, signingScheme }), (err) => {
      if (err) throw err;
    });
    fs.writeFile(`${directory}${fileNamePublic}.pem`, this.publicKey, (err) => {
      if (err) throw err;
    });
    fs.writeFile(`${directory}${fileNamePrivate}.pem`, this.privateKey, (err) => {
      if (err) throw err;
    });
    fs.writeFile(`${directory}${fileNamePublic}-to-copy-to-cli.pem`, this.publicKey.split('\n').join(''), (err) => {
      if (err) throw err;
    });
    fs.writeFile(`${directory}${fileNamePrivate}-to-copy-to-cli.pem`, this.privateKey.split('\n').join(''), (err) => {
      if (err) throw err;
    });
  }

  useExistingKeyPair() {
    this.publicKey = fs.readFileSync('./initializers/keys/default/public-key.pem', { encoding: 'utf8' });
    this.privateKey = fs.readFileSync('./initializers/keys/default/private-key.pem', { encoding: 'utf8' });
  }

  useCustomPublicKey(publicKey) {
    this.publicKey = publicKey;
  }

  useCustomPrivateKey(privateKey) {
    this.privateKey = privateKey;
  }

  encrypt(plainText) {
    const rsa = new NodeRSA(this.publicKey);
    const cipher = rsa.encrypt(plainText, 'base64');
    const directory = './exports/logs/' + parseTimestampForFileName(new Date());
    if (!fs.existsSync(directory)) fs.mkdirSync(directory);
    fs.writeFile(`${directory}/cipher.txt`, cipher, (err) => {
      console.log('Created new Cipher');
      if (err) throw err;
    });
    fs.writeFile(`${directory}/source.txt`, plainText, (err) => {
      if (err) throw err;
    });
    fs.writeFile(`${directory}/public-key.pem`, this.publicKey, (err) => {
      if (err) throw err;
    });
    fs.writeFile(`${directory}/private-key.pem`, this.privateKey, (err) => {
      if (err) throw err;
    });
    fs.writeFile(`${directory}/public-key-to-copy-to-cli.pem`, this.publicKey.split('\n').join(''), (err) => {
      if (err) throw err;
    });
    fs.writeFile(`${directory}/private-key-to-copy-to-cli.pem`, this.privateKey.split('\n').join(''), (err) => {
      if (err) throw err;
    });
    return cipher;
  }

  decrypt(cipher) {
    const rsa = new NodeRSA(this.privateKey);
    const plainText = rsa.decrypt(cipher);
    const directory = './exports/logs/' + parseTimestampForFileName(new Date());;
    if (!fs.existsSync(directory)) fs.mkdirSync(directory);
    fs.writeFile(`${directory}/cipher.txt`, cipher, (err) => {
      if (err) throw err;
    });
    fs.writeFile(`${directory}/source.txt`, plainText, (err) => {
      if (err) throw err;
      console.log('Cipher decrypted successfully');
    });
    fs.writeFile(`${directory}/public-key.pem`, this.publicKey, (err) => {
      if (err) throw err;
    });
    fs.writeFile(`${directory}/private-key.pem`, this.privateKey, (err) => {
      if (err) throw err;
    });
    fs.writeFile(`${directory}/public-key-to-copy-to-cli.pem`, this.publicKey.split('\n').join(''), (err) => {
      if (err) throw err;
    });
    fs.writeFile(`${directory}/private-key-to-copy-to-cli.pem`, this.privateKey.split('\n').join(''), (err) => {
      if (err) throw err;
    });
    return plainText;
  }

}

module.exports = { NodeRSAService };
