Dear Gemini, Make sure to read `../GEMINI.md` too: I DRY-ed some config instructions from there.

This folder, `~/git/vibecoding/bingems`, shall contain a number of "binary" files,
meaning executable files, which call a Gemini LLM in order to produce a markdown output.

Depending on the status of this folder, you might have to help me build them, or - if built - ensure they're fully functional. Every functionality can be invokable from a different executable (could be a bash script, or a `uv main.py`, ..), whatever, as long as the person invoking them can ignore installing dependencies from outside - that should be a straightfoward one off action and if the deps installation is not there, the installation should be achievable by running a single script (eg `just install`).

Use a justfile for important actions, starting with `just list` which shows the list (`just -l`).

# Binary Gems

Each of these gems should be a single file written in the lagugage you want which invokes an LLM and is able to run

Decide how much of these specs go into the code, and how much go into an LLM prompt for the LLM to always have them: you know better.

3. Reuse code! If you write program1 and program3 in ruby, I'd love the coloring functionality to be written ONLY once!
   1. Write tests in a way that if the coloring of program1 changes, program3 tests will fail too.

## 1. Zurich weather and sport forecaster

I'm an ironman and do train when I can. In the morning, the first thing I need to do is:

1. Check weather for the day: is it going to be sunny, or not?
2. Check Zurich see lake water temperature: is it swimmable? I can swim if there's a temperature of 20deg (Centigrad).
3. Check if the Hallenbad City is open today, sometimes it closes exp in July for 2 weeks.
4. I usually cycle 3-4 hours on weekends and ~2h on week days. It's important to identify the hours of day when i can cycle. My threshold for cycling in Spring-autumn is 18 degrees. In winter I can go down to 12 but its NOT fun. So assume 18 °C in March-October range.
5. In winter I'm going to do gym at work or swim.

Based on that, suggest if it's better to swim run or cycle.

I can run with rain, but not cycle.


## 2. Joplin reader and summarizer

Give me a calendar update of my health and work trips.

* I have a number of events captured under "Salute" folder.
* I have a number of events captured under "Travel" folder.

Cache all health and travel and communicate to me a bullet point of ideas.

The ouytput should be MARKDOWN and if
* I want it a bit structured. Give me FIRST a list of all folders with a folder emoji (unless
  you find the folder emoji which is actually stored inside joplin). if not, a generic folder 📁 is fine.
* the output NEEDS to be markdown compliant, and if `glow` is installed it should be "piped" into it to see beautiful
  colors and bolds and bullets.
* *the joplin script to support a --query, where i can ask a generic query and gemini will
  read all the notes and provide an answer :) Default query would be: tell me my next work events AND health events in
  calendar style for the next 3 weeks.
* Calendar should be as simple and dry as possible (do not say "nothing on day X"). Also its important you add a 3letter DOW. Example:
  • Wed Jun 18th: RailsHock @ Renuo Zurich (Work)
  • Thu Jun 19th: /dev/day Romandie (Work)
  Use 3 letter for DOW and 3 letters for month. I'm an engineer: perfect tabbing over completeness :)

## 3. Septober MCP

This is just an idea for the future. Ignore it for now. Maybe just create an empty skeleton file for future memory.
No further action required.
