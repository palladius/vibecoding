# Demo Modena

## Prep

One one window, run the server:

```bash
just run-dev
```

## 1. DEMO1 - Screenshots

```bash
just gemini-take-screenshots-via-playwright
```


On another terminal, you will need this:

```bash
gemini -c -y
```


## 2. Add event GDG DevFest Roma

Prompt:

```
I've just been invited to talk at devfest Rome.
Please add a talk on this event, and update the YAML.

* Saturday 25oct 2025.
* in Rome
* Devfest Rome (unknown URL - find it!)
* Demo on Gemini CLI.
* Organized by GDG Roma: https://gdg.community.dev/gdg-roma-citta/
* ensure hashtag DevFest and PendingWifeApproval since I'm not sure my wife wil approve this trip.

find a picture of the event online, if it doesnt work just find an image of the colosseum.
```

## 2. Add/Edit event - Modena 4oct

Prompt:

```
I'm presenting at a *DevFest Modena* event super-soon on "Sat 4 oct"!
* Event details are here: https://devfest.modena.it/
* My sessions are:
  * This morning, this demo/presentation on gemini cLI
  * this afternoon, a workshop on Rails/Gemini CLI/MCP.
* Ensure all the data are there. For any discrepancy, please check with me which of the two info is correct, and let's update the YAML.

Finally, please add this to my Apps Portoflio yaml in etc/ and update the DB.
```

## 2. Edit event - Pescara ugly picture

1. Show people the current next events..

```bash
open http://localhost:3001/next-talks
```

Give Gemini cli this prompt:

```
I know we have a DevFest Pescara in november. I dont like the current picture,
can you just google it and find a better picture? I remember that this year they
have a new version 2025 inspired to Man in black. Check if you find something appropriate.

If yes, change the yaml, and apply it the changes.
Download the image LOCALLY and do NOT change any typescript or any other files. just the YAML.
```


### If necessary, ask to find discrepancies

```
This week I'm in Modena for DevFest.
Check my event on YAML.
Then check on https://devfest.modena.it/ , look for my talks and sessions,
and find discrepancies, if any.
If you find discrepancies, shows them visually to me as a table with 1 row per discrepancy
and 2 columns: "Ours" (our web app) and "Theirs" (the official version on the web).
So I can propose a change visually.
```

Awesome result:

![4 discrepancies](image.png)

### 2.C Now Same with MCP

```
Now use MCP Chrome DevTools to navigate to the "Next Talks" (/next-talks) and ensure both the keynote and the workshop appear there.
```

```
Take a screenshot of that page with MCP DevTools if possible.
```

and it works!

![screenshot taken](image-1.png)

Let's check now the multimodality too...

```
What's written in yellow over those 2 sessions?
```

![Correctly identifies the yellow overwriting](image-2.png)

Chapeau.

## 3. MCP Chrome DevTools

```markdown

1. Ensure the app is started and is logging to log/ .
2. Use Chrome Dev Tools MCP server to check for client-side JS errors in the main endpoints (/, /talks, /about, ..).
   Also visit a sample talk (/talks/TALK_NAME) and a sample article page. Any errors there?
3. If you find any errors, enumerate them and add context in docs/investigations/chrome-devtool-clientside-errors.md
4. Finally, repeat the same experiment in PROD with the prod url. Is there some bug there?
   Add some h2 "## In production" section with any different findings, if any.
```

## Cleanup

```bash
git restore db/ etc/ scripts/ public/
```
