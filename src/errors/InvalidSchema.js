const httpStatus = require('http-status');
const APIError = require('./APIError');

class InvalidSchema extends APIError {
  constructor(message, results) {
    super(message, httpStatus.INTERNAL_SERVER_ERROR, results);
  }
}

module.exports = InvalidSchema;
