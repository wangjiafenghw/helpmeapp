var crypto = require('crypto');


var hash = function(str) {
  var hash = crypto.createHash('md5');
  hash.update(str);
  return hash.digest('hex');
}

module.exports = hash