const fs = require('fs');
const { NodeRSAService } = require('./node-rsa.service');
const NodeRSA = require('node-rsa');

class EncryptionService extends NodeRSAService {
  constructor({ useExistingKeyPair = false }) {
    super({ useExistingKeyPair });
  }
}
