# Hound remark

[remark] is Markdown processor powered by plugins. [remark-lint] is an remark
plugin for linting Markdown style.

`hound-remark` is a Node service that polls `RemarkReviewJob`s from the
`remark_review` queue, lints code with `remark-lint`, then pushes the results to
the `high` queue, as `CompletedFileReviewJob`s.

[remark]: http://remark.js.org/
[remark-lint]: https://github.com/wooorm/remark-lint

## Testing locally

First, add the following to the bottom of `index.js`:

```js
var testQueue = require("./lib/test-queue");

testQueue(redis);
```

Next, start the Resque web interface:

```bash
$ cd node_modules/node-resque/resque-web
$ bundle install
$ bundle exec rackup
$ open http://localhost:9292
```

As you run the worker, monitor how jobs flow through the queues.
