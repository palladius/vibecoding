## Problem

I have dozens of git repos, all under `~/git/<REPONAME>/`.
Many are open source and public on github, but then I have to maintain some private files, usually

* `.env` , or maybe a private documentation
* `.RICCARDO.md`

They could be anywhere in the repo, like

* ~/git/myrepo/.env
* ~/git/myrepo/sub/folder/.env
* ~/git/myrepo/sub/RICCARDO_PVT.md

## Context: My current solution

I created a solution where I hold all the passwords in a single, private repo.
Then I generate a folder with is repo-centric, like this:

```bash
$ ls git-privatize/
bitbucket.org__palladius__blahblahpoo
bitbucket.org__palladius__ror7-scubatracker-ng
github.com__aablsk__bank-of-anthos
github.com__Friends-of-Ricc__app-mod-workshop
github.com__GoogleCloudPlatform__bank-of-anthos
github.com__google-gemini__gemini-cli
github.com__magma-labs__magma-chat
github.com__palladius__ai-friendly-agents
github.com__palladius__app-mod-workshop-set-by-step
github.com__palladius__clouddeploy-platinum-path
[...]
```

So I basically use a double __ to separate the [vendor, user, reponame]

For example, under `github.com__palladius__vibecoding/` I have:

```bash
$ find github.com__palladius__vibecoding
github.com__palladius__vibecoding
github.com__palladius__vibecoding/.env
github.com__palladius__vibecoding/apps-portfolio
github.com__palladius__vibecoding/apps-portfolio/.env
```

Then i can call the script git-privatize like this:

```bash
$ git-privatize -h
~/git/sakura/bin/git-privatize v.0.2.3

 Usage: git-privatize [options] [ACTION] file1 file2 ...
   git-privatize status
   git-privatize privatize|add files1 file2 file3 ..
   git-privatize unprivatize files1 file2 file3 ..
   git-privatize sync
    -d, --debug                      enables debug (DFLT=false)
    -f, --force                      enables forcing on untest features (DFLT=false)
    -h, --help                       Display this screen
    -n, --dryrun                     Don't really execute code
    -v, --verbose                    Output more information
```

## Issues with current implementation

Well this has a few issues:
1. All my .env and password are held in a single github or bitbucket repo: if something happens, I break all eggs in a single paniere.
2. everything is

## My new solution: Secret Manager

I want to have a similar behaviour but I want to store all my passwords and secret files under Secret Manager. For consistency, I will pick a project_id and will ALWAYS use that.
The project shall be written under ~/.gcppm file (or whatever the name of the app you come with is :) ).

I want to be able to call the script in 2 ways:

1. Set/get password, which probably wraps a `gcloud secrets create/get`

```bash
$ gcppwd set mum-gmail-account
MyPAssword
$ gcppwd get mum-gmail-account
MyPAssword
```

2. Set/get files, like
```bash
$ gcppwd add .env
# => takes content of .env and copies on Secret Manager under some unique name per repo and subdir
$ gcppwd get .env
# => overwrite content of .env with whats in Secret Manager (parametric in reponame / folder)
$ gcppwd pull
# gets all
$ gcppwd push
# sets all
```

The difficult part is that we need to somewhat REMEMBER the files we have for this repo.
But just like this is a find in a file system we could do a secret manager filter with grep or with tags/labels. I let you choose the implementation.
