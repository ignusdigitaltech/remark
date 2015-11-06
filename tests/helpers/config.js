module.exports = {
  configContentFor: function(config) {
    var fullMdastConfig = {
      "plugins": {
        "lint": config
      }
    };
    return JSON.stringify(fullMdastConfig);
  }
};
