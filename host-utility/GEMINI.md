I want to create an application to be run on my ~5 Mac/Linux machines.

I want it to be modular and to run a number of tests.

All Tests need to be *cachable*, and the cache should be invalidated on a time basis, which defaults to 24h. I love to have caches in file under a `.cache/` folder (doesn't matter where), for readability.

This is because finding things in the filesystem is usually expensive and doesnt change much overnight. Executing this test a second time should terminate within 1-2 seconds max, or we architected it wrong! :)

Additional actions can be taken for those tests, inquiring the user.

The main goal of this application is to provide a quick overview of the system's health and offer actionable insights for cleanup and maintenance, and also provide some **safe** actionable way to cleanup things. The action should be part of the module itself, like find the big `node_modules/` and offer to remove them.

## Functional requirements

* the stdout should be very colorful (use red, green, and yellow/orange for warnings, errors, and successes). Use cyan and blue for file names.
* Usage of a library like `rich` (if Python) or `chalk` (if JavaScript) for terminal styling.
* Heavy usage of emoji to convey emotions and context with a single emoji, eg 💾 for a file.
* Code is in git. Use git to understand history!
* Think of this as declarative: if this file specifies to create 5 functions and you see 6, dont delete one, there is probably a reason for that to be. Again, `git log` / `git diff` is your friend.
* add a `justfile` for common functionalities like: install, run, and maybe some more interesting invokation (eg a an invocation of main with plenty of --options which is worth remembering, like debug or YOLO or disable cache).
* keep running `git add` of the files worth adding and `git status` which maybe teaches you to ignore some files.

## Core Functionality

1. **Disk space** is of paramount importance and it might have submodules, like:
   * `node_mmodules` and similar temporarily allocated folders. There should be a follow up function of cleanup. Same with python temporary folders and ruby temporary folders. Let's say python ruby and javascript would be the most common languages you'd find in my FS.
   * `docker images` again, with a follow up function of cleanup.
   * `apt` or `brew` size. Maybe some cleanup functionality can be issued here too.
   * git repos size. All my repos are under ~/git/<REPO> so enumerating and finding all is easy. Again a cleanup functionlaity could be done, like: "repo XYZ is 10GB and is all committed and wasn't modified in the past XX days, so it could be easily removed.
   * Anything else you can think of: size of /var/log, /tmp/ and other.
   * Overall disk size with a big warning if it's above 90% or free space is below 2GB (these numbers should have a configurable and sensible default, with 'default over confiuguration' in mind.)
   * This module should have functionalities like:
      * disk space before
      * disk space after (if I take the following actions)
      * followup_actions (eg, rm -rf aaaa/node_modules/).
2. **Assertions**. I do constant migration to my machines, maybe I migrated one and not the others. For instance, on jun25, I
   migrated a repo from Bitbucket to Github. a simple test could be assert_that(`grep git@github.com:palladius/gic25.git ~/git/gic/.git/config`). Note this will be useful for the next few months, then probably I'll disable it.

## Configuration

* Tests should be at least 2 levels deep, and togglable via a `yaml` config file: module and test.
* The user can be prompted to auto-execute these per-module actions, always from yaml config. Options are:
  * `disabled`: the test is disabled.
  * `prompt-user`: prompt the user to execute the action. User might be prompted multiple times (eg, 80 node_modules/ ..) so we need to find a clever way to make this work.
  * `auto-accept`: automatically execute the action.

As usual, assume a sensible default. So maybe something like:

```yaml
functions:
    disk_space:
        node_modules:
            description: Find all node_modules/ under ~/git/ recursively, gets their size, and if bigger than min_size offer to clean them up.
            enabled: true # This is the default
            creation_date: 2025-06-08
            followup_action: auto-accept # "rm -rf node_modules"
            # This is a custom field
            custom_fields:
                min_size: 100MB # If bigger than this, offer cleanup
                foor: bar # another custom field used by node_modules.
        docker_images:
            enabled: true
            creation_date:
            followup_action: prompt-user
        apt_size:
            enabled: true
            creation_date: 2025-06-08
            followup_action: disabled
            ...
    assertions:
        gic_migration_2024_06_25: false
```

## Output

The output of the test should also include a markdown-compliant `output-YYYYMMDD.md`, so we can send it to an LLM to take action or send email to me (`palladiusbonton@gmail.com`, once again - configurable).

This code will be shared broadly, so it needs to be created in a public github repo, and well documented, with a nice README and all.

Let's make sure that code folders reflect *exactly* the modules and tests (the Rails way!) so I can.
Let's start by outlining the project structure and core components.

Choose a language between Go, ruby, Python, javascript, rust. Whichever language has the most appropriate libraries to get the job done without bloating the code. Explain your reasoning to me, and keep adding it to a `AI_REASONING.md` file.

## Language

* If you choose `python`, do not use pip. Use some idempotent framework like `uv` so i can lay all the dependencies
  out easily for my computers.
* Same with ruby, use `rbenv` and `bundler`.
