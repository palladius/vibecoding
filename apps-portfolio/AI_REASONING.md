
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
