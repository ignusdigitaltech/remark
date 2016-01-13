var Queue = require("hound-javascript/lib/queue");

module.exports = function(redis) {
  var inbound = new Queue({
    redis: redis,
    queueName: "mdast_review",
    jobName: "MdasatReviewJob",
  });

  inbound.enqueue({
    content: "// TODO",
    config: "{ \"disallowKeywordsInComments\": true }",
  });
};
