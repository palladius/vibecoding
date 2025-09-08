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
* An auto-filled prompt (from DEFAULT_PROMPT), which is in 'select all' mode so:
  *  if person types <ENTER> or clicks SUBMIT, submits the prompt.
  *  But if the person types anything like "abc" it empties the prompt and substitutes with "abc".

## Implementation

* Codename for this repo is "Electric Banana" or "ElectroBanana"
* Use [Electron](https://www.electronjs.org/) and start making it work for Linux and Mac.
* Have a PLAN.md with a checklist of what needs to be done, and keep reading/writing it and keeping it updated.
* Let's find a smart way to manage BIG executable. Should we `git add` them with LFS? Or keep them outside of git? I'm not sure as I've never managed Mac/Win installers before.
* For any long standing feature, please have a GH issue called "[ElectroBanana] YOUR TITLE".

## App state

The app just needs to store two things:
1. `GEMINI_API_KEY` (default - by ENV of tereminal if it makes sense, otherwise from some system settings - but needs to be securely stored!).
2. `DEFAULT_PROMPT`, at birth it starts with "Merge the pictures together, and add a yellow heart in the bottom right of the resulting picture".

