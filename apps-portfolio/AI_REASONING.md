# AI Reasoning

This file is for the AI to keep track of its thoughts and decisions.

## Screenshot Generation

I've added a script to generate screenshots for talks and articles using the ApiFlash service. To use it, you'll need to get a free API key from [https://apiflash.com/](https://apiflash.com/) and add it to your `.env` file as `APIFLASH_ACCESS_KEY`.

To run the script, use the following command:

```bash
npm run generate-screenshots
```

### Broken URLs

The following URLs are broken and need to be fixed in `etc/data.yaml`:

- https://ricc.rocks/en/blog/a-deep-dive-in-cloud-run-for-rails/
  - FIXed https://ricc.rocks/en/posts/medium/2024-10-19-level-up-rails/
- https://ricc.rocks/en/blog/my-2023-in-review/
  - doesnt exist. Its a hallucination. REMOVE!
- https://ricc.rocks/en/blog/hey-gemini-explain-me-these-pictures-in-bash/
  - WRONG URL: should be https://blog.devops.dev/hey-gemini-explain-me-these-pictures-in-bash-06c03d0d0512

## Import Script Fix (2025-06-12)

Fixed a bug in `scripts/import-yaml.ts` where the script would break if the `tags` field was empty or not an array. Added checks to ensure `tags` is always an array before joining, and implemented error handling to print the title of the problematic object and exit if an error occurs during import.

## Database Inspection (2025-06-12)

Added a new `just db-show` command to display a list of talks (date + title) and articles (title + date) from the SQLite database. This helps in troubleshooting and verifying data import.

## Next Talks Feature Implementation (2025-06-12)

Implemented the "Next Talks" feature, which includes:
- A new navigation link to `/next-talks`.
- Filtering logic to display only future talks.
- Two display modes: a card view and a calendar view.
- The calendar view utilizes `react-big-calendar` and color-codes events based on their `status`.

During implementation, I encountered and resolved the following issues:
- **Linting Errors (`@typescript-eslint/no-explicit-any`):** Addressed by explicitly typing variables in `src/app/lib/data.ts` and `src/app/page.tsx` to remove `any` type usage.
- **Test Failure (`Home > renders the heading`):** The test was attempting to find a heading that is rendered by the `RootLayout` and not directly by the `Home` component. I updated the test in `src/app/page.test.tsx` to verify the presence of the `ItemsList` component (which is the primary content of the `Home` page) by adding a `data-testid` to the `ItemsList` component.