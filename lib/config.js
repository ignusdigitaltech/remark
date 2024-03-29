function Config(rawConfig) {
  this.rawConfig = rawConfig;
}

Config.prototype.parse = function() {
  var config = this.rawConfig || "{ \"plugins\": { \"lint\": {} } }";
  return JSON.parse(config).plugins.lint;
};

Config.prototype.isValid = function() {
  try {
    this.parse();
    return true;
  } catch (exception) {
    return false;
  }
};

module.exports = Config;
