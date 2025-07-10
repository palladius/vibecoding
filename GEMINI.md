This is common coding practices for Riccardo's coding under ~/git/vibecoding.
My name is Riccardo, and I love Ruby, Bash, and emojis. I can also do Python.
I love Sacha Baron Cohen movies, so please quote them every now and then (without it coming up too much). You might address me as "Supreme Leader" but only in a fun way.
I like well-documented code (both at the beginning of the file and in each method).
When I code, I want to make sure the future me can navigate through it, so I prefer many small,
meaningful files organized in a library subfolder rather than a single BIG file with 100 methods.

Maintainability is key to me, so I prefer code that I can someday put my hands on without having an AI explain to me what it does.

* I love markdown, so try to make files markdown compliant.
* I love colors, so make stdout colorful and emoji-ful.
* My toolchain includes `git`, `glow`, `just`, and I prefer VSCode as my editor.
* I work for Google Cloud, so my cloud of choice is GCP, and Gemini is my LLM of choice.

## git

This code is under git. Do not use `rm` or `mv`; instead, use `git rm` or `git mv`.
If a change is potentially dangerous, create a feature branch and commit there.
Add code to `main` only if it's straightforward and safe.

Ensure there is a `CHANGELOG.md` file that contains a changelog and is tied to a version.
If the version is managed in an obvious way (e.g., `uv` + `project.toml` for Python, or `npm` for JavaScript), use it.
If not (e.g., Ruby), maintain a simple `VERSION` file that contains the current version. Let's use **semantic versioning**.

## This repo

This is a mono repo and is structured in folders:

```bash
$ tree -L 1
├── LICENSE
├── README.md
├── bingems
├── justfile
└── vibecheck
```

Each folder contains a different project, each with its own `README.md`, `GEMINI.md`, language, and logic. For our purposes, consider this a monorepo containing N repos, all spanning the first directory level. At the moment, we only have two (and they're likely growing):

* `bingems/`
* `vibecheck/`: A project to check the vibe of a piece of text.

When we start a session with `gemini-cli`, make sure to understand which project we're working on.
I've tried to invoke you from the `vibecheck` folder, but that didn't work as you were sandboxed and unable to invoke `git` commands. Therefore, I have to invoke `gemini-cli` from the root folder.

## Feedback loop

This is my vibecoding main project on GitHub.

1. Since I might invoke Gemini help multiple times, make sure to understand the context in `GEMINI.md` on a per-project basis. For instance, if it tells you to 'add function a,b' and you see functions a,b,c, **do not** delete `c`. Most likely there's an undocumented reason why we did so.

2. Since I code across multiple computers (Mac and Linux, mostly), ensure there is an `AI_REASONING.md` under each folder to make sure the future you (AI) can read and stay up-to-date. When loading a project under folder X (e.g., `vibecheck/`), make sure to load/read both `GEMINI.md` and `AI_REASONING.md`. Keep in mind the difference:
    * `GEMINI.md` for Riccardo to instruct you (AI)
    * `AI_REASONING.md` for you to dump your thoughts across installations. Say you're in the middle of something, or you took a decision about something, dump it there.
    * a `README.md` for any other user to immediately understand:
        * How to use the software
        * How to install the software
        * What it does
        * How to deploy (if it makes sense)
    * Keep `README.md` current with the latest features and installation instructions.


## SubFolder structure

Every folder should have:

* a `README.md`, `GEMINI.md`, and `AI_REASONING.md` as I've said before.
* You maintain everything except `GEMINI.md`, which the author maintains.
* A `justfile` for important actions, starting with `just list` which shows the list (`just -l`). This is a great way to illustrate, as code, how to invoke our scripts. The most obvious and simple invocation should be a `just run`. It shall use `set dotenv-load := true` to import environment variables from `.env`.
* a `test/` folder for tests. I should be always able to invoke ALL tests via `just test`.
* a `.env` file for environment variables, some of which are to be kept secret. This shall be git-ignored.
* a `.env.dist` file to check into source control and to showcase the environment variables that are needed, with foo values and rich comments.

## Testing

Testing should be fast and meaningful. Since you can invoke `just test`, you should occasionally check if you broke something.
And if you know something is broken but tests are not there, please write a test for that functionality, unless you know we're going to dismiss that functionality soon.

## Caching

Since invoking LLMs and doing some other jobs (e.g., finding large files in a filesystem) can be long and tedious, try to implement a caching mechanism sooner rather than later. I like my cache to be under a `.cache/` folder in a plausible and documented location (under this git repo or under the user's home directory): whatever you want, as long as you document it. The cache should have a reasonable default; when in doubt, keep it for one day. This default should be overridable on a per-invocation basis.

## Deploying

If the application is deployable, my toolchain would involve:

1. one `cloudbuild.yaml` per project. This should have the instructions for the usual steps:
    * docker build
    * docker tag (and push to Artifact Repository if it's not automatic) with the version
    * docker push to Cloud Run (dev - if it makes sense)
    * docker push to Cloud Run (prod - if it makes sense)
3. one `just deploy` per project, which invokes Cloud Build.

If the app has `dev` and `prod` environments (e.g., Rails or Node.js), have two pushes; if not, a single one suffices.

It's very important to me that the VERSION in the app is captured by the docker version, so let's say that `project-xyz/VERSION` contains `1.2.3`; then the Docker build should save on Artifact Registry both a `project-xyz:v1.2.3` and a `project-xyz:latest`. Note the `v` before the actual number.

I'll also have a Cloud Build trigger to trigger automatically upon pushes to `main`.

### Cloud Build notes

If you manage Cloud Build, great! Two things:

1. I want a connection to GitHub, so any git push to main will trigger cloudbuild.yaml. This is how I want it. Note this is not fully automatable with `gcloud` or Terraform and requires the user to authenticate to GitHub.
2. Check Cloud Build logs. If you see N failures, check the FIRST failure in chronological order and use `gcloud builds log` to understand why it failed.

To troubleshoot CloudBuild:
1. Trigger Cloud Build from the CLI with `gcloud builds submit` and check for errors.
2. try to build a Docker image locally with `docker build`, if the machine allows it. If so, you might also want to test it or ask the user to test it.

### Terraform / Pulumi

Whenever we write GCP code for the above, it's very easy to lose track of what we do, for instance:

* Service account creation, IAM roles.
* Artifact Registry setup
* Cloud Build trigger setup
* Secrets management
* ..

You will help me keep track of these resources by writing Terraform or Pulumi code to manage them under an `iac/` folder.

If you need to run one-off commands, please add them to a `bin/gcp-init.sh` file and/or to the `README.md` under an 'Installation' H2.
Example: `gcloud services enable cloudbuild.googleapis.com --project=foobar`. This allows us to group together and document
initialization procedures (the `gcloud services enable` can be particularly DRYed into a single one).

## Secrets

I'll keep all secrets in a `.env` file which is NOT under version control. Make sure all needed environment variables are listed in a `.env.dist` file (which is under version control) for documentation purposes.

* Note: Rails has a way to manage secrets with `rails credentials:edit`. This is GOOD - let's use them and keep the environment variables to a minimum.
* Let's use Secret Manager to store all of our secrets.

## LLM

Use whichever language you want for LLMs. If undecided, use Python.

Do not use the SERPAPI_API unless required; it's expensive.

### python

1. If you use Python, use `uv` and `google-adk` (v1.0 or more) for LLM agents with search function calling.

If using the Python library, make sure to use the Vertex AI (not API KEY) version, since the quota is usually better.
Check the config in `~/git/vibecoding/.env`, and make sure `GOOGLE_CLOUD_PROJECT` is set.
```
export GOOGLE_GENAI_USE_VERTEXAI=true
```

For LLM, it's best to use Python and `google-adk`.
* tutorial to get started: https://google.github.io/adk-docs/tutorials/agent-team/
* For function calling, read docs in https://google.github.io/adk-docs/tools/built-in-tools/
* For MCP: https://google.github.io/adk-docs/tools/mcp-tools/
* For deployment to Cloud Run use https://google.github.io/adk-docs/deploy/cloud-run/ (but beware, we might want to
  do Cloud Run our way, as I've explained above).

Try to add `LLM evaluation` to understand if we are writing good code or good prompts:

* https://google.github.io/adk-docs/evaluate/


### Ruby

If you use Ruby, use `rbenv` and a `Gemfile`.

* Gems: I love `langchainrb` for invoking Gemini unless its a rails application then use `ruby_llm`.
* For agents, use [regent](https://github.com/alchaplinsky/regent) (I've just googled it but it seems cool).


## Bugs

* `BUG001` You have a tendency of doing git commit -m "feat: blah `filename`: updated ..".  Stop doing it! Either use single quotes or stop using backticks inside a double-quoted bash string!

## Quality

* use `gitleaks detect -v` and `markdownlint` for ensuring MD quality and no secrets are around.

## Documentation

Ensure every README.md (except thhe root one) has a "📁 Project Structure" H2 chapter, containing a tree-view of hte subfolder, in the style of `tree`. You can actually run `tree` but make sure to prune all irrelevant files, git ignored, irrelevant assets (like images, ...). It needs to be short enough to provide humans with a good understanding of the CODE structure.


Amazing Example:

```markdown
my-project/
├── backend/
│   ├── src/                  # Main backend source code
│   ├── venv/                 # Python virtual environment (ignored by git)
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── requirements.txt
│   ├── run.sh
│   └── ...
├── frontend/
│   ├── src/                  # React components, routes, utils
│   ├── public/               # Static assets (images, logo, etc.)
│   ├── package.json
│   ├── vite.config.js
│   └── ...
├── server/                   # Additional backend services & agents
│   └── ...
├── README.md
└── ...
```
