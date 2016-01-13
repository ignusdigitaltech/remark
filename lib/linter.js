var mdast = require("mdast");
var mdastLint = require("mdast-lint");
var Config = require("./config");

function Linter(houndJavascript) {
  this.houndJavascript = houndJavascript;
}

Linter.prototype.lint = function(payload) {
  var config = new Config(payload.config);

  if (config.isValid()) {
    var processor = mdast().use(mdastLint, config.parse());

    var results;
    processor.process(payload.content, function(_error, file) {
      results = file.messages;
    });

    var violations = results.map(function(error) {
      return { line: error.line, message: error.reason };
    });

    return this.houndJavascript.completeFileReview({
      violations: violations,
      filename: payload.filename,
      commit_sha: payload.commit_sha,
      pull_request_number: payload.pull_request_number,
      patch: payload.patch,
    });
  } else {
    return this.houndJavascript.reportInvalidConfig({
      pull_request_number: payload.pull_request_number,
      commit_sha: payload.commit_sha,
      linter_name: "mdast",
    });
  }
};

module.exports = Linter;
