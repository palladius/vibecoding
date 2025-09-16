## Eval

Sometimes the LLM creates something bad. Luckily Gemini is multimodal, so it can check the produced files.

By default, if it doesnt like an output in the out/ dir, it can just DELETE IT

## Solution

You can add some LLM test like:

"Ensure that file <self.output> is a PNG, using `file`"

or "Ensure that file <self.output> is a markdown contains a story in english and has 4 links to images"

Then we can add something like:

Return this in JSON..

* if ok: { "ret": "success"}
* if not: { "ret": "error", "error_message": "why it failed so we know how to fix it."}
