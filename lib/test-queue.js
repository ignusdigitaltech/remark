var Queue = require("hound-javascript/lib/queue");

module.exports = function(redis) {
  var inbound = new Queue({
    redis: redis,
    queueName: "remark_review",
    jobName: "RemarkReviewJob",
  });

  inbound.enqueue({
    content: "// TODO",
    config: "{ \"disallowKeywordsInComments\": true }",
  });
};
