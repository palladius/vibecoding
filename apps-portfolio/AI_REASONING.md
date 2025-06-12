# AI Reasoning

This file is for the AI to keep track of its thoughts and decisions.

## Screenshot Generation

I've added a script to generate screenshots for talks and articles using the ApiFlash service. To use it, you'll need to get a free API key from [https://apiflash.com/](https://apiflash.com/) and add it to your `.env` file as `APIFLASH_ACCESS_KEY`.

To run the script, use the following command:

```bash
npx ts-node scripts/generate-screenshots.ts
```