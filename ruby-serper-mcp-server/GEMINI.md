I wanna build a Ruby MCP Server which exposes:
- Google flights
- Google Hotels
You need to provide in input a SERPER_API_KEY and it will wrap around SERPER APIs.

## Plan before code

Before coding anything, do this instead:
1. add your plan to `docs/PLAN.md`.
2. Ask user to review it, maybe change a few things.
3. Read the plan, and agree with user to confirm the next steps.

The plan should have som sort of Task list - so you can update it whenever you complete a subtasks.

## Caching

Since API KEY calls are expensive, I want to have some sort of rudimental caching available, so that the SAME query would return cached results instead.

* Give me flights from ZRH to BER on 2025-07-10 back the day after -> CAlls API and dumps on `.cache/flights/something`
* Give me flights from ZRH to BER on 2025-07-10 back the day after -> Finds the file and returns values in it (robably JSON)

## API Docs

There are multiple SERP API providers, my fav is SerpAPI since it has also flights and hotels.

* https://serpapi.com/google-hotels-api
* https://serpapi.com/google-flights-api

They are also copied under `docs/serpapi.com/` folder for your convenience.

## Ruby MCP

you can use any ruby gem you wish.
