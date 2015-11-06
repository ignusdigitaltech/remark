var mdast = require("mdast");
var mdastLint = require("mdast-lint");

function parseConfig(config) {
  if (!config) {
    config = "{ 'plugins': { 'lint': {} } }";
  }

  try {
    return JSON.parse(config).plugins.lint;
  } catch (exception) {
    console.log("Invalid mdast-lint configuration:");
    console.log(config);
    console.log(exception);

    return {};
  }
}

function Linter(outbound) {
  this.outbound = outbound;
}

Linter.prototype.lint = function(payload) {
  var config = parseConfig(payload.config);
  var processor = mdast().use(mdastLint, config);

  var results;
  processor.process(payload.content, function(_error, file) {
    results = file.messages;
  });

  var violations = results.map(function(error) {
    return { line: error.line, message: error.reason };
  });

  return this.outbound.enqueue({
    violations: violations,
    filename: payload.filename,
    commit_sha: payload.commit_sha,
    pull_request_number: payload.pull_request_number,
    patch: payload.patch,
  });
};

module.exports = Linter;
