Use playwright to navigate to the prod application.

Ensure:

* /talks contains talks.
* /next-events contains events in the future.
* /about contains info about Riccardo
* In /talks, click on 2 random talks cards and ensure that particular talk is captured.

**ENSURE** this for all pages navigated:

* All links return 200.
* all pages return some high level content (no empty pages).

Create/maintain/update a `output/integration_testing/README.md` file which contains all your findings.
* Group all bugs or wrong things under a "## BUGS" h2 paragraph.
*  Also create a table containing:
   *  *endpoint*: URL endpoint (eg /talks)
   *  *entities_count*: a count of entities (eg 7 talks, 3 events)
   *  *notes*: Anything wrong or itneresting about this page. If nothing comes to mount, empty string is fine.

Create/maintain/update a `output/integration_testing/TIPS.md` file which contains all things you suggest could be do to improve the site, or its User Experience.
