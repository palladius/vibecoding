# BUG02: Talk pages fail to load in production

## REPRO

To reproduce this bug, just do this:

1. curl https://portfolio-app-272932496670.europe-west1.run.app/talks/2025-11-08-building-a-multi-agent-real-ai-travel-agent-with-python-and-ruby-and-mcp
2. this works in localhost, but in DEV it gives a 500 with this error: `Application error: a server-side exception has occurred while loading portfolio-app-272932496670.europe-west1.run.app (see the server logs for more information).`
3. this is also reproduceable in PROD: https://portfolio-app-prod-272932496670.europe-west1.run.app/ but for now lets fix dev.


## Symptom

When accessing a talk's detail page in the production environment (e.g., `https://portfolio-app-272932496670.europe-west1.run.app/talks/2025-07-10-from-monolith-to-magic-an-ai-powered-devops-workshop`), the page returns a 500 Internal Server Error and displays a "404: This page could not be found" message. This happens for all talk pages, not just those with special characters in the title. The application works correctly locally.

## Hypothesis 1: Incorrect `NEXT_PUBLIC_API_URL` at Build Time

As outlined in `BUG.md`, the most likely cause is that the `NEXT_PUBLIC_API_URL` environment variable is not being correctly passed to the Next.js build process *inside the Docker container*.

- The `Dockerfile` does not have an `ARG` for `NEXT_PUBLIC_API_URL`, so it's not available during the `npm run build` step.
- The `cloudbuild.yaml` sets the variable for the *runtime* environment, not the *build-time* environment.
- The client-side code in `src/app/lib/data.ts` relies on this variable to be present at build time to make API calls.

If this hypothesis is correct, the client-side JavaScript is trying to fetch data from an `undefined` or incorrect URL, leading to the error.

## Hypothesis 2: Slug Generation Mismatch [Riccardo: this CANNOT BE, since only 1 talk has special characters]

While the initial thought was that special characters were the issue, the fact that it's failing for all talk pages suggests a more fundamental problem. However, it's still possible that there's a subtle mismatch between how the slug is generated in the `getTalks` function (which creates the links) and the `getTalk` function (which fetches the data for the page). This seems less likely now that we know all pages are failing.

## Hypothesis 3: Database Not Being Updated in Production [Riccardo: this CANNOT BE, as all talk are visualized correctly in index]

It's possible that the production database is not being correctly updated with the latest data from `etc/data.yaml`. If the `just import` command is failing silently in the production container, the database would be out of sync with the `data.yaml` file, and the slugs would not match.

## Hypothesis 4 (Riccardo): wrong value for NEXT_PUBLIC_API_URL in Cloud run (run time)

* Currently, the NEXT_PUBLIC_API_URL in `portfolio-app-prod` (https://portfolio-app-prod-272932496670.europe-west1.run.app ) is empty.
* I've changed manually to `NEXT_PUBLIC_API_URL=https://portfolio-app-prod-272932496670.europe-west1.run.app` in revision `portfolio-app-prod-00004-c2x`.
* And it works!


## Next Steps

Based on the evidence, Hypothesis 1 is the most likely culprit. The next step is to fix the `Dockerfile` and `cloudbuild.yaml` to ensure that `NEXT_PUBLIC_API_URL` is available during the build process.
