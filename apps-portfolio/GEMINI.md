I am riccardo Carlesso (my prnouncs are he/him and my emojis are '💛') and I work in Google Cloud as a Developer Advocate.
My job is to create demo apps such as this one, do presentations and participate at events.

I would like to create a shiny "Portfolio" application in JS and whatever. this portfolio should highlight my **demos** and **talks**.
Since a talk can have a demo, we need to conflate both objects in a similar Blob. We'll use GCP Firestore for schemaless data,
so we can iterate fast on data without having to adhere to a strong schema.

I'm a Ruby on Rails developer so I think in Rails terms, as you can see.

Please read `../GEMINI.md` for additional generic practices. In the doc you can see that I want docker images built
with `portfolio-app:v$VERSION`, not `portfolio-app`. Tell me if you can't read that file, it's really important to me.

PLEASE DO WARN ME if you CANNOT read `../GEMINI.md`!! I need to know and fix it!

## Functional requirements.

* Just to make sure we navigate well through vibe coding, let's ensure all document 'leaves' have a schema_version (so we have the ability to add both to documentation or in code something like "field xyz is available since v1.2.3" or "field abc was renamed abd in v2.3.4").
* The app shall be built with Cloud Build and pushed to Cloud run. It will be visible to everyone.
* The app should have a visual appeal and a wow factor. do not hesitate to add flashy JS libraries to make flashy colorful transitions. Note this app is both a serious portfolio app and a demo, so I do care about the wow factor more than having a lean/fast-loading JS since it's not going to have 1000 QPS :)

## Database and view

* The DB shall have two entities: **talks** and **events**. they will visually be quite differentiated, through different colors and visualization.
* Read `../GEMINI.md` for additional generic requirements for my coding preferences. when in conflict, *THIS* doc wins.
* The code should be testable with sqlite3 in localhost for ease, and connect to Firebase in production. Some jobs to push/pull/sync from local sqlite to firebase would be nice to have.
* All entities should have an `updated_at` and `created_at` timestamps, unless Firestore supports them natively.
* All entities should support string tags (labels). Every tag will be visualized with hash (eg #ruby #SRE ..), as monospaced colorful labels of text. If I click on one of the tags,
  all entities of this tag will be visualized with some nice JS animation. note tags should span across multiple entities, so a #Ruby tag in an event should probably visualize cards for both events and talks with that tag
* I should be able to search for a word within a title or description of anything, and a card vs table-row visualization should both be possible.
* I should be able to swap between Cards and table visualization with a click as a preference. Cards of events vs talks should have different colors.
* Document the E/R diagram with `mermaid` in the README.md of this app, please under "DB SChema" (even if its schemaless).

### **Event** model

For an event, its important I can navigate externally to this event, whether its a RubyDay, a Cloud Next, or WeAreDevelopers.
An event should have a title, day, description, ..
* optionally, a link to speakers (so you can see Riccardo is in there!)
* would be nice to have an image for all events, so you can visualize them in Card format nicely.

### **talk** model

* A talk would have a title, an abstract, a presenter (likely Riccardo), maybe a demo, and plenty of links
* A talk could be in tentative mode (maybe i just have a CfP application before).
* Make sure to manage the change management:
- before the event, i have just title and description
- after the event, i might have a link to a video with a nice screenshot of Riccardo presenting there. Note this usually happens 3-6 months after the event, so do not expect that all "past events" have this. Usually only 20-30% of my talks are recorded.
- There should be some sort of status, like applied for CfP vs confirmed vs delivered.
* Riccardo gives 0+ talks to an event, usually one.

### **article** or **resource** model (for the future)

I'd like in the future to also have an array of articles and workshop resources. Maybe we could call it "resource" and have some sort of `type` field to specialize it.
* it will have: `title`, `description`, `URL` and `publish_date`. Depending on what it is, it might have additional fields.
* We don't have to implement it now, but if you create a YAML dump of my data, you better add these already just to keep the YAML consistent.

## Code

I'm no javascript expert. Try to use more libraries and less custom code, when possible.

Code should eb easy to maintain. Keep in mind that after you write the code for me, I need to perform two actions in this order:

P1. Add more talks/events (we can do this without login to start with, just give me some script to add from local YAML or so)
P2. Change the code.

It would be really nice if my events are actually stored in YAML so I just edit the YAML and an import script pushes this to sqlite3 (local) or Firestore (dev/prod).

## Google Cloud

* ensure there's a `.env` file with google project id and region so we write it down once. Do NOT check it in source code
  in case it starts to host private information.
* Keep a `.env.dist` in sync with needed info for users to be able to copy my demo.
* Use terraform for infra seand one-off setups (eg, ensure that SvcAcct exists and has the right powers, ..)
* CloudBuild: ensure it both builds the `v$VERSION` and also `latest` (which basically always symlinks/points to the latest version we update).
* Note that `google.com` policy doesn't allow Cloudrun to add with `allUsers`. No biggie. Teach me to see it on my browser as ricc@google.com

### Terraform

Terraform should lay the foundations of our setup, so that changing the project id and do a terraform apply should be all we need to get our app in a new project.

* Add the one-off IAM, Cloud build, SM, AR setups on a `iac/` folder for terraform.
* It needs to pick up ENVs from our `.env/` (ok to have redundant PROJECT_ID and TFSTATE_PROJECT_ID if need be)
* All Terraform artifacts (VMs, Service Accounts, secrets, ..) will start with a "tf-" prefix, to ensure I can distiguish manual from automated.
    * If the entity supports a description, the description should start with a common string: "[Created with 🌍 Terraform] "
* Very few things cannot be 100% automated (eg I remember a Cloud Build Trigger triggering on github push requires the flow done by human to complete the github auth flow).
  If you find yourself blocked there, please update the README.md under a "## Terraform Setup" H2 stanza.
* Once again, I want YOU to do terraform setup and terraform apply to catch the errors.

## Feedback loop (me and you)

I want you (Gemini) to be as independent to fix errors as you can.

This is why we've agreed that I run `just run-dev` for you (hopefully in port 3001 - make sure it runs on that port) so you can inspect `log/dev.log`
and trigger anything by just curl'ing localhost on the endpoint you wanna test!

Similarly I want you to be able to call `docker build` by yourself and trigger a Cloud Build from CLI so you can "listen"
to its errors and course-correct by yourself!

This is to minimize user interaction. If you're ever blocked (eg, "drag and drop the first card onto the second card"), I'm here for you.

Do NOT enter in infinite loops like:
* `just run`
* `just run-dev`. I run this for you, on port 3001. Check logs under `log/`
* `just docker-run`. I can run this for you, on port 8080, upon request. figure out a way to log under `log/docker.log`

as you're unable to exit these loops, and this forces me to kill our chat. I'll run them for you upon request.

# Samples Data

I'm going to add under `etc/` some talks I've done in the past so you can "seed". These are copies from this site:

https://github.com/palladius/my-sessions-and-bio/

These are:

* `etc/README.md`: contains an extensive list of all my talks. This is the most important. (100% exaustive AFAIK)
* `etc/workshops.md`: a list of workshop (not exaustive)
* `etc/talks.md`: a list of my talks (90% exaustive)

I'm going to paste here some sample event/talks.

* Take inspirations from all the fields here for possible string fields (CfP, SessionURL, ..)

## BUGS from gemini-cli

Pay attention here:

* Do NOT use backticks `` in a git commit, EVER! you tend to execute code and make it in the commit message which is public, and this is DANGEROUS!
* DO NOT TOUCH `.env` EVER ! It's not under git so you can break it forever!

## Sample talks

* If you need them, sample talks are under `etc/SAMPLE_TALKS.md`

## BUG FIXING


When I ask you to assess a bug, I expect you to do many changes by yourself.

Before committing any change, let's make sure:

1. Ensure the code is working in localhost on port 3001:
   * if server is not responding, check with user that the server is up, meanwhile check similar ports like 3001 and 3003.
   * curl http://localhost:3001/ and see some articles (must NOT be empty!)
   * All links on top work (talks, article, about me, next talks), make sure they return 200 and they do NOT show empty content.
   * Also single pages should work:
     * 1. curl `/talks/2025-10-14-agents-on-a-plane-a-deep-dive-into-building-a-real-time-travel-agent works` too
     * 2. curl `/articles/2024-02-05-autotranslate-my-hugo-blog-with-gemini` too
   * just test works.
   * Possibly implement this test under `bin/test-generic-endpoint.sh` or javascript.
2. If this works, mentally add a "localhost BUG02 check works" to future commit message
3. run `just docker-build` and check the build succeed.
4. Ask user to run `just docker-run` for you (you're not good at background jobs yet! and docker execution can be quite sticky to CTRL-C).
  1. Run the same tests at (1) but on port 8081.
5. If this works, mentally add a "local docker BUG02 check works" to future commit message
6. at this point, prepare a commit message, commit and ask user whether you can push.
7. After push, keep monitoring every 2 minutes the latest triggered Cloud Build. You can use my convenience scripts
 `just cloud-build-list` and `just cloud-build-show-log {{build_id}}` for it.


Prefer triggering cloud Build by just git commit/pushing than triggering a build yourself from CLI. Leave that with me.

STOP CHANGING `cloud_build.yaml` and the `build` target in `justfile`
