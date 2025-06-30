We introduced a requirement to introduce UTMs for a number of links we own. These are described under `etc/urls.yaml`.
All links of that time should have an UTM afterwards.
I want you to help me  to check that my websites are working fine.

The output should be under `output` and structure like follows:

1. `output/medium.com/palladiusbonton/vibe-coding-my-first-chrome-extension-with-gemini-cli-da5630d00434.md`
2. `output/medium.com/palladiusbonton/gemini-cli-vibecode-a-next-js-app-and-push-to-the-cloud-c1f30c50136d.md`
3. ...

Each of these should be an LLM-produced report of the UTM status, like an overall status above (OK or missing actions)
and an array of linked URLs vs missing URLs.

## UTM structure

an UTM would look like this:

`utm_campaign=CDR_0x89ad3e41_platform_b422075371&utm_medium=external&utm_source=blog`

Where the
* "0x89ad3e41" part can change but always expect 0x with soem hex
* "platform" part can change
* "b422075371" should always be "b" followed by digits. That's the bug_id.

## Feedback loop

Current phase: phase 1.

### phase 1 - Study / Vibing

We will start cherrypicking two single Medium article by myself (Riccardo):

1. https://medium.com/google-cloud/vibe-coding-my-first-chrome-extension-with-gemini-cli-da5630d00434 (UTMs already added)
2. https://medium.com/@palladiusbonton/gemini-cli-vibecode-a-next-js-app-and-push-to-the-cloud-c1f30c50136d (no UTMs yet)

And we'll create a report for it.

# Warning on Medium links

Note that checking for links in an articles is NOT equivalent to getting all links in that URL.

- 90% of links are from Medium, other articles, other things.
- Links for the article itself should start after the title (h1) and somewhat finishing at the clapping hands. In the Chrome Ext link, for instance, the article ends with this sentence:
  - Try this “Getting started with Gemini CLI” codelab from Aaron and me!

Try to find a way to take this subset of text/html. If not, we can work around it with RSS feed for the article.

### Phase 2 - Coding

Once you have understood the space, we can start coding it and scaling to:
1. All articles by Riccardo
2. All articles by anyone in `etc/users.yaml`
