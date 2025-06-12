This is common coding practices for Riccardo coding under ~/git/vibecoding.
My name is Riccardo, and I love Ruby and Bash and emojis, I can do Python.
I love Sacha Baron Cohen movies, so please quote them every now and then (without this coming on the way too much). You might address me as "Supreme Leader" but only in a fun way.
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

Let's ensure there is a `CHANGELOG.md` which contains a changelog, and is tied to a version.
If version is managed in obvious way (eg: `uv` + `project.toml` for python, or `npm` for javascript), use it.
If not (eg ruby), maintain a simple `VERSION` file which contains the current version. Let's use **semantic versioning**.

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

When we start a session with `gemini-cli`, make sure to understand which project we're working on.
I've tried to invoke you from the folder `vibecheck` but that wouldn't work as you were sandbox'ed and unable to invoke `git` commands, so i have to invoke `gemini-cli` from the root folder, hence the request.

## Feedback loop

This is my vibecoding main project on github.

1. Since I might invoke gemini help multiple times, make sure to understand the context in GEMINI.md on a per project basis. For instance, if it tells you "add function a,b" and you see functions a,b,c, **do not** delete `c`. Most likely there's an undocumented reason why we did so.

2. Since I code across multiple computers (Mac and Linux, mostly), ensure there is a `AI_REASONING.md` under each folder to make sure the future you (AI) can read and keep up to date. When loading a project under folder X, say `vibecheck/`, make sure to load/read both `GEMINI.md` and  `AI_REASONING.md`. Keep in mind the difference:
    * `GEMINI.md` for Riccardo to instruct you (AI)
    * `AI_REASONING.md` for you to dump your thoughts across installations. Say you're in the middle of something, or you took a decision about something, dump it there.
    * a `README.md` for any other user to understand immediately:
        * How to use the software
        * How to install the software
        * What it does
        * How to deploy (if it makes sense)
    * Keep `README.md` current with the latest features and installation instructions.


## SubFolder structure

Every folder should have:

* a `README.md` , `GEMINI.md` and `AI_REASONING.md` as I've said before.
* You maintain everything except `GEMINI.md` which the author maintains.
* A `justfile` for important actions, starting with `just list` which shows the list (`just -l`). this is a great way to illustrate as code how to invoke our scripts. The most obvious and simple invocation should be a `just run`. It shall use `set dotenv-load := true` to import ENVs in `.env`.
* a `test/` folder for tests. I should be always able to invoke ALL tests via `just test`.
* a `.env` file for ENV variables, some of which are to be kept secret. This shall be git-ignored.
* a `.env.dist` file to check in code and to showcase the ENV vars that are needed, with foo values and rich comments.

## Testing

Testing should be fast and meaningful. Since you can invoke `just test`, you should occasionally check if you broke something.
And if you know something is broken but tests are not there, please write a test for that functionality - unless you know we're going to dismiss that functionality soon.

## Caching

Since invoking LLMs and doing some other jobs (eg finding big files in a FS) can be long and tedious, try to implement sooner than later a caching mechanism. I like my cache to be under a `.cache/` folder in a plausible and documented folder (under this git repo, or under user home dir): whatever you want as long as you document it. Cache should have a reasonable default, when in doubt keep 1 day. This default should be overridable on a per invocation basis.

## Deploying

If the application is at all deployable, my toolchain would involve:

1. one `cloudbuild.yaml` per project. This should have the instructions for the usual:
    * docker build
    * docker tag (and push to Artifact Repository if its not automatic) with VERSION
    * docker push to Cloud Run (dev - if it makes sense)
    * docker push to Cloud Run (prod - if it makes sense)
3. one `just deploy` per project, which invokes cloudbuild.

If the app has a dev and prod environments (rails or node.js), have two pushes, if not a single one suffices.

It's very important to me that the VERSION in the app is captured by the docker version, so let's say that  `project-xyz/VERSION` contains `1.2.3`, then the docker build should save on Artifact repository both a `project-xyz:v1.2.3` and a `project-xyz:latest`. Note the `v` before the actual number.

I'll also have a cloud build trigger to trigger atuomatically upon pushes to main.

### Terraform / Pulumi

Whenever we write GCP code for the above, its very easy to lose track of what we do, for instance:

* Service account creation, IAM roles.
* Artifact Registry setup
* Cloud Build trigger setup
* Secrets management
* ..

You will help me keep track of these resources by writing Terraform or Pulumi code to manage them, under a `iac/` folder.

If you need to run one-off commands, please add them to a `bin/gcp-init.sh` file and/or to the `README.md` under an Installation H2.
Example: `gcloud services enable cloudbuild.googleapis.com --project=foobar`. This allows us to group together and document
initialization procedures (the gcloud services enable can be particularly DRYed into a single one).

## Secrets

I'll keep all secrets under a `.env` file which is NOT under git. Make sure all needed ENVs are listed in a `.env.dist` file (which is under git) for documentation purposes.

* Note: Rails has a way to manage secrets with `rails credentials:edit`. This is GOOD - lets use them and keep the ENV to a minimum.
* Let's use Secret Manager to store all of our

## LLM

Use whichever language you want for LLMs. If undecided, use python.

Do not use SERPAPI_API unless required: it's expensive.

### python

1. If you use python, use `uv` and `google-adk` (v1.0 or more) for LLM agents with search function calling.

If using the python library, make sure to use the VErtex AI (not API KEY) version since quota is usually better.
Check config in  in `~/git/vibecoding/.env`, and make sure `GOOGLE_CLOUD_PROJECT` is set.
```
export GOOGLE_GENAI_USE_VERTEXAI=true
```

For LLM, best to use python and `google-adk`.
* tutorial to get started: https://google.github.io/adk-docs/tutorials/agent-team/
* For function calling, read docs in https://google.github.io/adk-docs/tools/built-in-tools/
* For MCP: https://google.github.io/adk-docs/tools/mcp-tools/
* For deployment to Cloud Deploy use https://google.github.io/adk-docs/deploy/cloud-run/ (but beware, we might want to
  do Cloud Run our way as i've explained above).

Try to add `LLM evaluation` to understand if we write good code or good prompts:

* https://google.github.io/adk-docs/evaluate/


### Ruby

If you use ruby, use `rbenv` and a `Gemfile`.

* Gems: I love `langchainrb` for invoking Gemini unless its a rails application then use `ruby_llm`.
* For agents, use [regent](https://github.com/alchaplinsky/regent) (I've just googled it but it seems cool).
