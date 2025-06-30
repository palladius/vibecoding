We introduced a requirement to introduce UTMs for a number of links we own. These are described under `etc/urls.yaml`.
All links of that time should have an UTM afterwards.
I want you to help me  to check that my websites are working fine.

The output should be under `output` and structure like follows:

1. `output/medium.com/palladiusbonton/vibe-coding-my-first-chrome-extension-with-gemini-cli-da5630d00434.md`
2. `output/medium.com/palladiusbonton/gemini-cli-vibecode-a-next-js-app-and-push-to-the-cloud-c1f30c50136d.md`
3. ...

Each of these should be an LLM-produced report of the UTM status, like an overall status above (OK or missing actions)
and an array of 1. linked URLs vs 2. missing URLs (meaning URLs with no UTM but which match the 'regex' in `etc/urls.yaml`) vs 3. all other URLs (irrelevant to me)

## UTM structure

an UTM would look like this:

`utm_campaign=CDR_0x89ad3e41_platform_b422075371&utm_medium=external&utm_source=blog`

Where the
* "0x89ad3e41" part can change but always expect 0x with some hex
* "platform" part can change
* "b422075371" should always be "b" followed by digits.

## Feedback loop

Current phase: phase 1.

### phase 1 - Study / Vibing

We will start cherrypicking these 2-3 single Medium articles by myself (Riccardo) or Remi:

1. https://medium.com/google-cloud/vibe-coding-my-first-chrome-extension-with-gemini-cli-da5630d00434 (UTMs already added)
2. https://medium.com/@palladiusbonton/gemini-cli-vibecode-a-next-js-app-and-push-to-the-cloud-c1f30c50136d (no UTMs yet)
3. https://medium.com/google-cloud/step-by-step-serving-pytorch-models-with-a-custom-handler-on-vertex-ai-5ada1d01c534 from my buddy Remi - unsure
   1. Note this should appear under its user name https://medium.com/@rsamborski not Google Cloud !!

And we'll create a report for it.

Find more URLs to test in phase 1 in `etc/users.yaml` under `sample_articles:` stanza.

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

## Caching

Keep cache for 1 day - do NOT re-download websites if you have a cache hit.

## report notes

* ignore local links: `/...`.
* `sort | uniq -c` links: so that this looks like this:

```markdown
# original
* `https://miro.medium.com/v2/resize:fill:304:304/10fd5c419ac61637245384e7099e131627900034828f4f386bdaa47a74eae156`
* `https://miro.medium.com/v2/resize:fill:240:240/10fd5c419atitle: "The UTM Finder"
   url: https://medium.com/@palladiusbonton/the-utm-finder-2f0c1d3e4f5ac61637245384e7099e131627900034828f4f386bdaa47a74eae156`
* `https://miro.medium.com/v2/resize:fill:152:152/10fd5c419ac61637245384e7099e131627900034828f4f386bdaa47a74eae156`
* `https://miro.medium.com/v2/resize:fill:120:120/10fd5c419ac61637245384e7099e131627900034828f4f386bdaa47a74eae156`
* `https://miro.medium.com/v2/resize:fill:1000:1000/7*GAOKVe--MXbEJmV9230oOQ.png`
* `https://glyph.medium.com`
* `/manifest.json`
* `https://glyph.medium.com/css/unbound.css`
* `https://glyph.medium.com/css/unbound.css`
# after your pass
* `https://miro.medium.com/v2/resize:fill:304:304/10fd5c419ac61637245384e7099e131627900034828f4f386bdaa47a74eae156` 4x
* `https://miro.medium.com/v2/resize:fill:1000:1000/7*GAOKVe--MXbEJmV9230oOQ.png`
* `https://glyph.medium.com`
* `https://glyph.medium.com/css/unbound.css` 2x
```

Extract from UTM the b422075371 by adding a slash after b, like b/422075371 and add this after the UTM-ified link.

Finally create an uber-report `output/REPORT.md` which contains:

1. a tabular list of all articles
2. in each row, there is
   1. the article TITLE, linked to the local MD file
   2. An emoji of link linked to the remote article, like `[emoji](link)`
   3. Number of UTMs applied
   4. Number of missing UTMs.
   5. Total # links.
   6. B-number(s) (like b/1234567) as is, linked to itself: http:/b/{{NUMBER}}, if available from UTMs

Code this and let me know if this is 100% deterministic or if we need to have an LLM massage the rough edges.
