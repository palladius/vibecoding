I wanna build a Ruby MCP Server which exposes:
- Google flights
- Google Hotels
You need to provide in input a SERPER_API_KEY and it will wrap around SERPER APIs.


## Caching

Since API KEY calls are expensive, I want to have some sort of rudimental caching available, so that the SAME query would return cached results instead.

* Give me flights from ZRH to BER on 2025-07-10 back the day after -> CAlls API and dumps on `.cache/flights/something`
* Give me flights from ZRH to BER on 2025-07-10 back the day after -> Finds the file and returns values in it (robably JSON)

## API Docs

There are multiple SERP API providers, my fav is SerpAPI since it has also flights and hotels.

* https://serpapi.com/google-hotels-api
* https://serpapi.com/google-flights-api
*
