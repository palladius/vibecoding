# Demo Modena

## Prep

```bash
gemini -c -y
```

## 1. Screenshots

```bash
just gemini-take-screenshots-via-playwright
```

## 2. Add/Edit event

I'm presenting at a *DevFest Modena* event today!
* Event details are here: https://devfest.modena.it/
* My sessions are:
  * This morning, this demo/presentation on gemini cLI
  * this afternoon, a workshop on Rails/Gemini CLI/MCP.
* Ensure all the data are there. For any discrepancy, please check with me which of the two info is correct, and let's update the YAML.

Finally, please add this to my Apps Portoflio yaml in etc/ and update the DB.

## 3. MCP Chrome DevTools

```markdown

1. Ensure the app is started and is logging to log/ .
2. Use Chrome Dev Tools MCP server to check for client-side JS errors in the main endpoints (/, /talks, /about, ..)
3. If you find any errors, enumerate them and add context in docs/investigations/chrome-devtool-clientside-errors.md

```

## BugFix HARD = magari salta

`docs/CUJ/` and paste
