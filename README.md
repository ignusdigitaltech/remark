# Hound mdast

[mdast] is Markdown processor powered by plugins. [mdast-lint] is an mdast
plugin for linting Markdown style.

`hound-mdast` is a Node service that polls `MdastReviewJob`s from the
`mdast_review` queue, lints code with `mdast-lint`, then pushes the results to
the `high` queue, as `CompletedFileReviewJob`s.

[mdast]: http://mdast.js.org/
[mdast-lint]: https://github.com/wooorm/mdast-lint

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
