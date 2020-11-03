const fs = require('fs');
const { NodeRSAService } = require('./node-rsa.service');
const NodeRSA = require('node-rsa');

class DecryptionService extends NodeRSAService {
  constructor({ useExistingKeyPair = false }) {
    super({ useExistingKeyPair });
  }
}
