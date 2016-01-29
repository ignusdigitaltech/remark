module.exports = {
  configContentFor: function(config) {
    var fullRemarkConfig = {
      "plugins": {
        "lint": config
      }
    };
    return JSON.stringify(fullRemarkConfig);
  }
};
