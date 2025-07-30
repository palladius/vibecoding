## 1. Product Requirements Document: Real-world Family Travel agent

### 1.1. Overview

This document outlines the requirements for a prompt-native sub-agent orchestration system in the Gemini CLI. The system will allow a master agent ("concierge" or "travel agent") to delegate complex tasks to specialized "sub-agents" (which are themselves instances of ADK agents with specific prompts and tools).

* **v1.0** The entire lifecycle of these agents—creation, task assignment, execution, and status tracking—will be initially managed through CLI commands and the `adk serve` to test its functionality.

* **v2.0** Once the CLI works, I want a web frontend (Node JS with any framework you wish) to connect to some local sqlite file (but easy to move to PostgreSQL some day soon in the future). The web frontend should have a login to memorize user prefs.

### 1.2. App overview

The user will prompt the app with basically two fields: a location, and a date range, and any additional requirements. These can be both loose:
* "I want to go to the beach this summer in Europe on 20250720-20250730 with my whole family. We'd love the mediterranean sea but not X,Y,Z cos we've already visited. Kids want pools and water games."
* "We want to go to Barcelona sometime in October 2025 without kids. My wife wants a Spa and a nice pool in the hotel and wants to do horseriding. Our budget should be <1000 euros for the weekend (flights, hotel, food) if possible."
* "I'm going for work to Las Vegas on 2026-04-10 to 2026-04-14 for work and I'd like to extend my stay for the weekend of 14-17. I've already seen the GRand Canyon, what do you suggest I do? I have no particular budget restrictions, but keep it reasonable".

User preferences can and should be tracked per user (see below).

### 1.2.1 Reality check

* This demo will make REAL calls to the internet. The hotels, Airbnb, flights will **ALL BE REAL**. This is non negotiable, although it's fine to test/mock eith fake data for dev reasons. v1.0 and v2.0 will NEED to be real data.
* In this demo we will NOT book flights or hotels. While it's *highly desirable* that the final plan might have a real permalink to a booking place (Google Flight permalink, booking.com or airbnb link with dates prefilled), it's not this app intent to actually BUY the stuff. Maybe in v3 :)

### 1.3. Tech Stack

This demo is intended to demonstrate Google ADK, A2A, Gemini CLI and MCP so hear me out:

1. Agents will be **Google ADK** v1.0+ agents. Use Context7 MCP to code on these since it has a volatile codebase. Use ADK memory to memorize users preferences (like name, age, passport id of family components).
3. Agents will interact with each other talking **A2A** protocol by Google.
4. The agents will reach out to real-world scenarios via MCP servers. See below for MCP servers I'd like you to use

#### 1.2.1 MCP Servers

* Use the great **Airbnb MCP server**
* Use **SERPER APIs** to use both Flights and Hotel information. This will be coded by us and the code is currently in `../ruby-serper-mcp-server/` (not complete yet). I have an API KEY in .env
* Use `context7` MCP to code `google-adk` code, and possibly also for the rest (ruby for MCP), ..
* Use `playwright` for UI testing (buttons, ..).

### 1.3. Required Directory Structure

The following directories must be created within the user's project under `.gemini/`:

- **src/**: The code goes here. This is to separate from other stuff, like IaC etc, for ease of dockerization
- **src/agents/**: The code for all agents
- **src/agents/{AGENT_NAME}/**: The code for agent XYZ
- **src/app-v1/**: Contains the v1 CLI app.
- **src/app-v2/**: Contains the v2 Web app.
- **doc/**: All documentation, uer guides, READMEs, and Gemini PLANs.


### 1.4. The Sub-Agents "Personas"

Sub agents should be:

1. A **Planning agent**, responsible for the whole planning. This will interact with other agents.
2. A **budget agent**, responsible to match the proposed trip to family needs. If no budget is required, they still need to give a final ballpark of total holiday price (eg 12000 CHF, in local pref currency). Budget agent will help Planning Agent **keep it real** and is the only one (together with final user) who can veto a program altogether.
3. A **family planner**, responsible to match the provided Trip plan with people preferences (eg, my wife wants a swimming pool in the hotel, or kids want a sushi place walking distance).
4. A **flight agent**, responsible for flight booking which will constrain the hotel dates and logistics (is it a late flight? Taxi to the hotel or nice bus available?).
5. A **city agent** will make sure the plan includes events happening in the city in that week/weekend. This could also piggyback to other agents. For example: "big concert -> pricier hotels -> maybe change weekend" or "recent terrorist attack -> avoid altogether, but if user confirms prices will be A LOT cheaper".
6. A **hotel agent** responsible for finding the perfect hotel. This will require user VISUAL confirmation, also in V1! Agent will do its research via MCP and will prompt the final user to choose among 5 top hotels and 5 top airbnb ranked by the agent and with some stars assigned. The list should add intelligent stuff like "1/10. This was the best hotel, central but a bit pricesy", "2/10 this was the cheapest and central BUT doesnt have the pool as required", and so on. It will visualize the price per night and the 1..5 stars in whichever local system it is (let's ignore airbnb / hotels might have different meaning). Use emojis to convey additional information (beachfront, pool, aircon, wifi, ...).
7. An **Activity agent** who will make a **calendar plan** for the family, once flights and hotel are decided. The agent will be aware of the calendar, and the context. Some expected intelligence:
   - if family land at 23:00 at the airport, there is no use in getting a big day trip the day after, and maybe we can chill in the morning
   - a day trip to a very popular destination like Jardins du Versailles or Disneyworld or Rulantica should be planned in off-days (eg week days).
   - check for local festivities, maybe the Thursday is the Santo Patrono of Bologna and all is closed.
   - Festivities can be good for cetain activities (stroll in city center) and bad for others (eg, Disneyworld)

### 1.4.1 user preferences

Use preferences should be saved in some way (LLM memory, Database, or file). We can start with a YAML file:

```yaml
#etc/user-preferences.yaml
people:
  - name: Riccardo
    role: main # this is the agent interlocutor
    dob: 1976-12-29
    preferences: geeky stuff, technology, keeping my kids happy.
  - name: Kate
    role: wife
    dob: 1970-01-01
    preferences: nature, animal, posh, strongly wants a swimming pool in the hotel (check its usable in the time we go), chocolate.
  - name: AJ
    dob: 2018-01-01
    role: first child
    preferences: loves animals, particularly dogs, and pokemon cards
  - name: Sebster
    dob: 2020-01-01
    role: second child
    preferences: loves animals, particularly horse riding. Loves all means of transportations like trams, busses, planes, ..
travel_preferences: |
  Keep busy most of the time. We don't like to rest too much.
  We don't like sunbathing or sand.
  We are foodies and look good food. Kids love sushi.
```

### 1.5. User interaction

The agents will interact with the user to ask high level questions, but shouldn't invade too much. Something like:
* **5 flights proposals**, sorted by #connections and price.
* **10 hotels proposals**, sorted by LLM ranking based on (proximity to <city_center/beach/...>, price, and # matching preferences). This needs to be VISUAL in some HTML form which allows user to see the vicinity aspect and the #1 .. #10 in the LLM order.
* **Activity plan**. This is interactive so user might say: "no this is too much we want to stay by the beach more" or "this is too little, we want to do AT LEAST a day trip somewhere outside BArcelona as we've been SO LONG - maybe suggest something nice outside the city for a day trip".

Each of these user interactions might take a few back and forth. If a major budget shift is expected (eg, the only direct flight is 12000usd but 1 lay over makes it 3000usd this should be possibly validated by the Budget Agent).

### 1.6. User Workflow Example: a week in BCN with family

Example. *User wants to go to BArcelona for a week hoping for sun and some seaside if weather allows.*

* *USER PROMPT*: "I want to go to Barcelona for Zurich school holidays of 10-15 October. If we're lucky, we want to try having a bath at the sea - so we want to be close to the beach. Consider splitting the holiday in two as 50% by the city and 50% in a popular beach location, not more than 1h away. We dont have particular budget restrictions, but keep it reasonable (4* hotels), and lets maximize our holiday time!".
* *Concierge Agent* starts working on a plan, starting with a flight proposal which locks the dates. Unfortunately he can't propose a hotel because the location needs to be agree before hotels are booked.
* Concierge: **I found these flights X Y Z, from Saturday 8 October to Sunday 17 October to maximize your trip. . Imorning I suggest X as it's direct from Zurich and cheasp, but arrives at midnight. I suggest to go to Sitges as its a nice beach place close to BArcelona and I suggest you start the 50/50 in Sitges as the flight is late and so the kids can sleep when going to the hotel. This will leave the second part of the trip in Barcelona where you're closer to the airport to go back. do Sat-Wed in Sitges vs Wed-Sun in BArcelona work for you?**.
* User: "I confirm the flight proposal and the split, but make it 1 day less in Sitges and 1 more in Barca as there's more to do in the city, and weather might be horrible."
* Concierge: **Great idea!**. Now the concierge can call the Hotel Agent for the Sitges Sat 8 - Tue 11 oct and Barcelona 11-17. Once the hotels are done a new proposal will be done.
* LLM: **"Here are some hotel choices in Sitges: `doc/20251007-barcelona-proposal1234/HOTEL_PLAN_01_SITGES.html`. I suggest the "Pedra del sole" because .... Check the map and tell me your choice with name or 1-10."**. HTML will contain a Map contains Sitges (which shows also the sea and the train station among other things), and highlights the 10 hotels/B&B choices. Hotels will have some sort of HOVER with STARS, hotel name, 1-10 LLM ranking, and a 10-15 words max description from LLM which is contextual to suer prefs, eg "this is a bit pricey but has the pool".
* Once user confirms the hotel choice, the Hotel Agent will go back and read all possible reviews for the hotel and validate through the request with some prompt like "given this user preference/request, do you think this hotel is ok? <PASTE of USER FEEDBACKS on hotel X>...". This could give a last minute feedback like this. "[LLM] **Wait, although the hotel does have a swimming pool, people complained that its only open from July to September. Should I go back and rerank the hotels and present an updated map removing the pool from this? Hotel #7 does have a pool but comments say its an internal, warmed up pool all year around**"
* after user gives confirmation, and we block the first hotel, a second Hotel flow will start for location 2 (Barcelona). At this point, the Concierge will propose to user a second hotel choice, eg **"Here are some hotel choices in Barca: `doc/20251007-barcelona-proposal1234/HOTEL_PLAN_02_BARCA.html`. I suggest the "1. Cinco de Mayo" in the Barceloneta as it has a beach vibe, or the B&B "3. Pinco Palinho Jose" in city center if you prefer a very connected B*B and you want a local wash machine as you'll have accrued some washing after 3 days with small kids.... Check the map and tell me your choice with name or 1-10.". All choice have a (beach) or (center) in the description depending if you prefer beach front or if you had enough of it with Sitges and prefer a more central location.**
* After user confirms their preference, concierge will either ACCEPT the hotel choice or refine in a particular location, like: **[LLM] Ok I understand you prefer city center and close to the Parc Guell as secluded and cheap and good for hikes so here are 10 options not too far from the park: `doc/20251007-barcelona-proposal1234/HOTEL_PLAN_02B_BARCA_PARC_GUELL.html`"**.
* After hotels have been confirmed, we can finally start the itinerary process. Some back and forth will be done, where some activities are proposed on some days, alongside with price, suggested transportation, suggested time of the day, and the right percentage of "busy time" vs "relax time". This should probably captured in some preference.
* LLM: **Based on your preferences, I've proposed a this itinerary plan in `doc/20251007-barcelona-proposal1234/ITINERARY_PLAN_try1.md`: chill on Sunday, .. on monday, chill on Tuesday; you can transfer to BCN when you want taking a train from the main station, otherwise a taxi will cost you XXX EUR (however Sebster is definitely going to enjoy the train ride!) then its a very easy metro transfer to your B&B. There's a sushi place you might want to check on Tue evening - so you might want to go back later. On Wed I suggest you visit Parc Guell, then ... and on Sunday you can ho back with a taxi around HH:MM which will leave you enough time to check your luggage and do some shopping at the airport.**
*  There will be some back and forth on the itinerary and more itinerary plans might be done and discussed.
*  When everyone is satisifed and we reach quiescence, the final plan should go in `doc/20251007-barcelona-proposal1234/FINAL_PLAN.md`. It should contain a H2 "Synopsis" with the reasoned plan and constraints (pool) with reality check (pool wasnt available ...). A H2 "Synopsis" will have a overall plan, not more than 10 lines, 1 bulletpoint per day no more. Use emoji to convey more with less. Then a H2 "TODOs" will contain a checklist of things to do; use MD checklist so user can update it as things get done; it could be buy ESTa for kids, buy sunscreen, and so on. Then a H2 "detailed plan" will follow, divided by date; this will be potentially multibullet point and if rich will need to be broken down by H3 per day, and could be 2-3 pages long; this is ok. A H2 "Map" will contain a Google Map of the location(s) will have hotel(s) and travel to location as it makes sense. Finally a H2 "Costs" will have a rough breakdown of all costs, starting with flights and hotels. THis will be in TABLE format and have emojis for the costs, plus will have a generic daily budget for food and transportation. This will be reasoned below and also this will have a copy in `doc/20251007-barcelona-proposal1234/budget.csv` for ease of import in Google Sheets.
*  User might have some say in this final document, like :adjust food budget to +20% to accommodate to tip / gelato in BCN / .. and this will then update budget and plan and CSV.
*  When everything is ok, a `STATUS.md` (or YAML/JSON so its easier to verify) will be added with "Status: approved" and a timestamp of approval, version of the software, and so on. Actually this should be available since the beginning.
* Logs will go somehwre inside `doc/20251007-barcelona-proposal1234/???.log`, maybe one per agent so we can reconstruct the whole logic.

## Feedback loop

* Use github for major features/bugs which should ALL start with this folder name "[adk-a2a-hotels-maps-demo] ..." and interact with it with `gh`.
