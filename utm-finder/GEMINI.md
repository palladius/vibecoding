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

* DONE: phase 1.
* currently in phase 2.

If you take some important decision which is NOT in GEMINI.md, please add it to `DECISIONS.md`. Be as concise as possible, but add rationale (the WHY).


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

Have a `justfile` target for every relevant script invocation (generate reports, cleanup, .., invalidate cache, ..).

Cache should be daily and it should be leveraged (lets not `CURL` the whole internet at every invocation!)

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

1. a tabular list of all articles, sorted by Date DESC.
2. in each row, there is
   1. Publication date (Date in `YYYY-MM-DD` format). Article publication. needs to be the first column since we order by it.
   2. the article TITLE, linked to the local MD file (stripping out `output/` or it wont work!). Then in parenthesis, add author name " (Name Surname)" AFTER the link (should NOT be linked).
   3. An emoji of link linked to the remote article, like `[🔗](https://..)`
   4. Number of UTMs applied
   5. Number of missing UTMs.
   6. Total # links.
   7. B-number(s) (like b/1234567) as is, linked to itself: http:/b/{{NUMBER}}, if available from UTMs. Deduplicate in case you have duplicates: `| uniq ` and count doesnt matter.

Code this and let me know if this is 100% deterministic or if we need to have an LLM massage the rough edges.

- Do NOT commit or push without me - ABSOLUTELY. REMEMBER this and add to your memory.

## BUGs

You're discarding too much:

Current:

Processing RSS feed: https://medium.com/feed/@palladiusbonton
  Skipping non-article link: https://medium.com/@palladiusbonton/gemini-cli-vibecode-a-next-js-app-and-push-to-the-cloud-c1f30c50136d?source=rss-b5293b96912f------2
  Skipping non-article link: https://medium.com/@palladiusbonton/wip-code-3d-kid-games-with-gemini-2-5-d580d6b9802b?source=rss-b5293b96912f------2
  Skipping non-article link: https://medium.com/@palladiusbonton/ruby-on-rails-with-postgresql-on-cloud-run-bdaaf0b26e0b?source=rss-b5293b96912f------2
  Skipping non-article link: https://medium.com/@palladiusbonton/hey-bard-write-a-responsive-javascript-search-engine-app-for-me-b2585e55385e?source=rss-b5293b96912f------2
  Skipping non-article link: https://medium.com/@palladiusbonton/what-is-toilet-papers-right-side-8da0504d6d0b?source=rss-b5293b96912f------2


Desired:

Processing RSS feed: https://medium.com/feed/@palladiusbonton :

  Skipping non-article link: https://medium.com/@palladiusbonton/what-is-toilet-papers-right-side-8da0504d6d0b?source=rss-b5293b96912f------2

Is there a chance that if u find an article to skip, you skip ALL for that user (bad loop)?
