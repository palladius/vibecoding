# MCP + Playwright demo (screenshots and navigation)

Use playwright tool to take screenshots of the portfolio application.

The application is running on http://localhost:3001.

Take screenshots of the homepage `/`, `/about` page, `/talks` page, and `/articles` and `/next-talks` page, and `/config`. For those pages with buttons which allow you to select a different view, take a screenshot both of the Card and Calendar/List view.
Also take a sample of:

* Sample Talk: `/talks/2025-11-15-beyond-blame-the-art-of-the-postmortem`
* Sample article: `/articles/2022-12-31-reimagining-customer-services-with-genai-and-multi-modal-interaction`
* Note these two pages tend to give 404 errors.

Put those screenshots under `docs/screenshots/YYYYMMDD/dev/` (today's).

If possible use 800x600 screen size and picture size. Give them a consistent name, maybe first look if those files exist already to keep the same name and use git to save their evolution.

Report under `docs/screenshots/YYYYMMDD/README.md` a list of those images, and report any errors you spot on those images (eg empty talks/articles/next talks..). Also calculate the time to do ALL of this, by calling `date` and adding date start and date end to the README.md file.

## PROD app

Now do the same as above for https://portfolio-app-272932496670.europe-west1.run.app/... endpoints
and put the screenshots under `docs/screenshots/YYYYMMDD/prod/`.

<!--  IGNORE THIS

## WAD Jurre - Zurich Max

Now compare /talks in PROD and in LOCALHOST and show the difference between the two images and put them in docs/screenshots/diff/ and add a README.md there
Do you spot any difference?

-->
