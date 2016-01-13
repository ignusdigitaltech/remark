var RSVP = require("rsvp");
var Redis = require("fakeredis");
var HoundJavascript = require("hound-javascript");
var Linter = require("../lib/linter");
var lastJob = require("./helpers/redis").lastJob;
var configContentFor = require("./helpers/config").configContentFor;

QUnit.module("Linter");

RSVP.on("error", function(error) {
  throw new Error(error);
});

asyncTest("mdast linting", function() {
  var redis = Redis.createClient();
  var houndJavascript = new HoundJavascript(redis);
  var linter = new Linter(houndJavascript);
  var payload = {
    content: "# Hello\n",
    config: configContentFor({ "heading-style": "setext" }),
    filename: "filename",
    commit_sha: "commit_sha",
    pull_request_number: "pull_request_number",
    patch: "patch",
  };

  linter.lint(payload).then(function() {
    lastJob(redis, "high", function(job) {
      start();

      equal(
        job.class,
        "CompletedFileReviewJob",
        "pushes the proper job type"
      );
      deepEqual(
        job.args[0],
        {
          violations: [ { line: 1, message: "Headings should use setext" } ],
          filename: "filename",
          commit_sha: "commit_sha",
          pull_request_number: "pull_request_number",
          patch: "patch",
        },
        "pushes a job onto the queue"
      );
    });
  });
});

asyncTest("Reporting an invalid configuration file", function() {
  var payload = {
    content: "// TODO",
    config: "---\nyaml: is good\ntrue/false/syntax/error",
    filename: "filename",
    commit_sha: "commit_sha",
    pull_request_number: "pull_request_number",
    patch: "patch",
  };
  var redis = Redis.createClient();
  var houndJavascript = new HoundJavascript(redis);
  var linter = new Linter(houndJavascript);

  linter.lint(payload).then(function() {
    lastJob(redis, "high", function(job) {
      start();

      equal(
        job.class,
        "ReportInvalidConfigJob",
        "pushes the proper job type"
      );
      deepEqual(
        job.args[0],
        {
          commit_sha: "commit_sha",
          pull_request_number: "pull_request_number",
          linter_name: "mdast",
        },
        "pushes a job onto the queue"
      );
    });
  });
});
