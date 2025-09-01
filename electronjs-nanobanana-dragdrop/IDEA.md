## Context

Nano Banana Gemini model came last week. wow. It allows you to Merge N pictures and have some sort of editing functionality like:
*  IMAGE+PROMPT -> IMAGE
*  IMAGE1+IMAGE2+PROMPT -> IMAGE

The idea is simple: wrap this functionality with a nice UI app.

## CUJ/UX

* User, on Mac/Linux/Windows (Mac takes precedence) has a Finder app open and select two pictures with the mouse.
* User right-clicks.
* The contextual menu offers a "{bananaemoji} Edit with NanoBanana.."
* User chooses this.
* An auto-filled prompt


## App state

The app just needs to store two things:
1. `GEMINI_API_KEY` (default - by ENV of tereminal if it makes sense, otherwise from some system settings - but needs to be securely stored!).
2. `DEFAULT_PROMPT`, at birth it starts with "Merge the pictures together, and add a yellow heart in the bottom right of the resulting picture".
