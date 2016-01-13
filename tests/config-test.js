var Config = require("../lib/config");
var configContentFor = require("./helpers/config").configContentFor;

QUnit.module("Config");

test("Parsing an MDast config file", function() {
  var config = new Config(
    configContentFor({ "heading-style": "setext" })
  );

  deepEqual(
    config.parse(),
    { "heading-style": "setext" }
  );
});

test("Given an empty config file", function() {
  var config = new Config(null);

  deepEqual(
    config.parse(),
    {}
  );
});

test("Determining a valid configuration file", function() {
  var config = new Config(
    configContentFor({ "heading-style": "setext" })
  );

  equal(
    config.isValid(),
    true
  );
});

test("Determining an invalid configuration file", function() {
  var config = new Config("---\nyaml: is good\ntrue/false/syntax/error");

  equal(
    config.isValid(),
    false
  );
});
