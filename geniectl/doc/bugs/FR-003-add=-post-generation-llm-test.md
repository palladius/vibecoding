
Riccardo, sometimes some UGLY stuff is created.
You can add some LLM test like:

"Ensure that file <self.output> is a PNG"

or "Ensure that file <self.output> contins a story in englih and has 4 links to images"

Then we can add something like:

Return this in JSON..

* if ok: { "ret": "success"}
* if not: { "ret": "error", "error_message": "why it failed so we know how to fix it."}
