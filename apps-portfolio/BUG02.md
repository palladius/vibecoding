# BUG02: Talk pages fail to load in production (FIXED)

## Symptom

When accessing a talk's detail page in the production environment, the page returned a 500 Internal Server Error. This happened because the frontend code, which runs in the user's browser, did not know which API URL to call.

## Root Cause: Build-Time vs. Run-Time Environment Variables

The core of the issue lies in how Next.js handles environment variables prefixed with `NEXT_PUBLIC_`.

1.  **Build Time (`next build`):** When the application is built, Next.js performs a "search and replace" for any `process.env.NEXT_PUBLIC_` variables. It finds their value *at that moment* and bakes the literal string value into the final JavaScript files.

2.  **Run Time (`next start`):** When the application is running on a server, the JavaScript files sent to the browser already have the URL hardcoded in them. Changing the environment variable on the server at this point has no effect on the already-built frontend code.

Our previous approach of building a single Docker image and trying to supply the API URL at run time was flawed. The image was built without a URL, so the frontend code was trying to fetch from `undefined/api/talks`.

## The Solution: Relative URLs & Direct Database Access

The correct and most robust solution is to make the application code environment-agnostic.

1.  **For Client-Side Code (in the browser):** We now use relative URLs (e.g., `fetch('/api/talks')`). The browser automatically knows to make the request to the same domain that is currently hosting the page. This works seamlessly for `localhost`, the dev URL, and the prod URL.

2.  **For Server-Side Code (on the server):** A server component should not `fetch` its own API, as this is an inefficient network hop. Instead, server-side data fetching functions now bypass `fetch` and call the underlying database logic directly, just as the API routes do.

This approach allows us to use a **single, universal Docker image** that works in any environment without changes, simplifying our entire build and deployment process.