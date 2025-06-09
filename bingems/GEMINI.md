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

Based on that, suggest if it's better to swim run or cycle.

I can run with rain, but not cycle.


## 2. Joplin reader and summarizer

Give me a calendar update of my health and work trips.

* I have a number of events captured under "Salute" folder.
* I have a number of events captured under "Travel" folder.

Cache all health and travel and communicate to me a bullet point of ideas.


## 3. Septober MCP

This is just an idea for the future. Ignore it for now. Maybe just create an empty skeleton file for future memory.
No further action required.
