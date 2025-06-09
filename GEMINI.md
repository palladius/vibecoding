This is common coding practices for Riccardo coding under ~/git/vibecoding.
My name is Riccardo, and I love Ruby and Bash and emojis, I can do Python.
I like well documented code (both at the beginning of the file, and in each method).
When I code, I want to make sure the future me can navigate through it, so I prefer many small
meaningful files organized in some library sub folder, than a single BIG file with 100 methods.

Maintainability is key to me, so I prefer code which i can someday put my hands on without having an AI explain me what it does.

* I love markdown, so try to make files to be markdown compliant.
* I love colors, so make stdout to be colorful and emojiful.
* My toolchain includes `git`, `glow`, `just`, and I prefer VSCode as my editor
* I work for Google Cloud, so my cloud of choice is GCP, and Gemini my LLM of choice.

## git

This code is under git. Do not do rm/mv, but rather git rm / git mv.
If a change is potentially dangerous, consider creating a feature branch and committing there.
Add code to main only if its straightforward and safe.

## This repo

This repo is structured in folders:

```bash
$ tree -L 1
├── LICENSE
├── README.md
├── bingems
├── justfile
└── vibecheck
```

Each folder contains a different project, each with its own README.md and GEMINI.md, language and logic . For our purposes, consider this as a monorepo containing N repos all spanning the first directory level. At the moment, we only have two (and likely they're growing):

* `bingems/`
* `vibecheck/`: A project to check the vibe of a piece of text.


## Feedback loop

This is my vibecoding main project on github.

1. Since I might invoke gemini help multiple times, make sure to understand the context in GEMINI.md on a per project basis. For instance, if it tells you "add function a,b" and you see functions a,b,c, **do not** delete c. Most likely there's an undocumented  reason why we did so.

2. Since I code across multiple computers (Mac and Linux, mostly), ensure there is a `AI_REASONING.md` under each folder to make sure the future you (AI) can read and keep up to date. When loading a project under folder X, say `vibecheck/`, make sure to load/read both `GEMINI.md` and  `AI_REASONING.md`. Keep in mind the difference:
    * `GEMINI.md` for Riccardo to instruct you (AI)
    * `AI_REASONING.md` for you to dump your thoughts across installations. Say you're in the middle of something, or you took a decision about something, dump it there.
    * a `README.md` for any other user to understand immediately:
        * How to use the software
        * How to install the software
        * What it does
        * How to deploy (if it makes sense)
    * Keep `README.md` current with the latest features and installation instructions.
