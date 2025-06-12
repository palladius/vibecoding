I am riccardo Carlesso and I work in Google Cloud as a Developer Advocate. My job is to create demo apps, do presentations and participate at events.

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
* Add the one-off IAM, CB, SM, AR setups on a `iac/` folder for terraform. It needs to pick up ENVs from our `.env/`
* CloudBuild: ensure it both builds the `v$VERSION` and also `latest` (which basically always symlinks/points to the latest version we update).

## Feedback loop (me and you)

I want you (Gemini) to be as independent to fix errors as you can.

This is why we've agreed that I run `just run-dev` for you (hopefully in port 3001 - make sure it runs on that port) so you can inspect `log/dev.log`
and trigger anything by just curl'ing localhost on the endpoint you wanna test!

Similarly I want you to be able to call `docker build` by yourself and trigger a Cloud Build from CLI so you can "listen"
to its errors and course-correct by yourself!

This is to minimize user interaction. If you're ever blocked (eg, "drag and drop the first card onto the second card"), I'm here for you.

Do NOT enter in infinite loops like:
* `just run`
* `just run-dev`. I run this for you, on port 3000. Check logs under log/
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

## 2024/25 talks (not exaustive!)


### SRE Gone Wrong: Top 7 Errors (and How to Avoid Them) (Turin, 26 Mar 25)

* Session Link: https://2025.cloudconf.it/en/schedule.html
* When: March 26.
* Where: Turin, Italy
* Event: CloudConf

#### Abstract

I've been talking to customers re their SRE adoption since 2019. Oftentimes, they struggled in their effort to apply the Google methodology within their company. In this talk Riccardo will first set an introduction to SRE, then try to explain what failures patterns he's observed (partly contained in Enterprise Roadmap to SRE report).
Topics:
- What SRE is.
- What SRE is not.
- Anti-patterns in SRE adoption
- How to make it work for your company

## 2024

### Keynote: SRE Gone Wrong: Top 7 Errors (and How to Avoid Them) (Amsterdam, 21 Nov 24)

* Session Link: https://sreday.com/2024-amsterdam/#modal-speaker-0
* When: November 21.
* Where: Amsterdam, Netherlands
* Event: SRE Day

### News Crawler via Langchain.RB and Gemini APIs (Pescara, 8 Nov 24)

* Session Link: https://sessionize.com/app/speaker/session/739236
* When: November 8.
* Where: Pescara, Italy
* Event: GDG Devfest

### News Crawler via Langchain.RB and Gemini APIs (Modena, 12 Oct 24)

* Session Link: https://sessionize.com/app/speaker/session/745608
* When: October 12.
* Where: Modena, Italy
* Event: GDG Devfest

### Keynote: Dove l'SRE può andare storto (Bologna, 11 Oct 24)

* Session Link: https://www.devsecopsday.it/talks_speakers/
* When: October 11.
* Where: Bologna, Italy
* Event: DevSecOps day

### SRE Jumpstart (Budapest, 17 Sep 24)

* When: September 17.
* Where: Budapest, Hungary (remote)
* Event: GDG Budapest

### Workshop: Bring your Ruby app in the Cloud (Sarajevo, 11 Sep 24)

* Session Link: https://2024.euruko.org/speakers/riccardo_carlesso
* When: September 11.
* Where: Sarajevo, Bosnia and Herzegovina
* Event: Euruko 2024 ([speakers](https://2024.euruko.org/all_speakers/))

### News Crawler via Langchain.RB and Gemini APIs (Zurich, 21 Aug 24)

* When: August 21.
* Where: Zurich, Switzerland
* Event: Railshöck at Puzzle

### News Crawler via Langchain.RB and Gemini APIs (Verona, 31 May 24)

* Session Link: https://2024.rubyday.it/talks_speakers/
* When: May 31.
* Where: Verona, Italy
* Event: RubyDay

### Software development with Google (Turin, 29 May 24)

* Session Link: https://2024.cloudconf.it/index.html
* When: May 29.
* Where: Turin, Italy
* Event: CloudConf

### Goodbye, deployment headaches: Cloud Deploy and Vertex AI unite (Las Vegas, 11 apr 24)

My very first Google Cloud Next presence.

* Session Link: https://cloud.withgoogle.com/next?session=DEV302
* When: April 11.
* Where: Las Vegas, NV, USA
* Video: https://www.youtube.com/watch?v=_NlGk9Ao_oA
* Public Slides: https://assets.swoogo.com/uploads/3794522-661c3c8fe0cf9.pdf

#### Abstract

Continuous Deployment can be a roadblock in the MLOps lifecycle, often requiring custom pipelines and complex configurations. Solution? The new integrations of Google Cloud Deploy and Vertex AI revolutionizes machine learning (ML) deployment by automating the entire process, and makes it easy to roll back through idempotent releases. The groundbreaking integration of Cloud Deploy and Vertex AI lets you test, validate, and deploy your ML models in minutes, without writing a single line of code.

## Article and events (not exaustive!)


## Articles

Medium ([main page](https://medium.com/@palladiusbonton/) - [RSS feed](https://medium.com/feed/@palladiusbonton)) Blog:

* 2024-02-05 [Autotranslate my Hugo blog with Gemini](https://ricc.rocks/en/blog/autotranslate-my-hugo-blog-with-gemini/)
* 2024-01-23 [A deep dive in Cloud Run for Rails](https://ricc.rocks/en/blog/a-deep-dive-in-cloud-run-for-rails/)
* 2024-01-12 [My 2023 in review](https://ricc.rocks/en/blog/my-2023-in-review/)
* 2023-12-29 [Hey Gemini, explain me these pictures - in bash](https://ricc.rocks/en/blog/hey-gemini-explain-me-these-pictures-in-bash/)
* 2023-11-20 [Hey Bard, write a responsive Javascript Search Engine app for me..](https://medium.com/@palladiusbonton/hey-bard-write-a-responsive-javascript-search-engine-app-for-me-b2585e55385e)
* 2023-11-16 [Automated insights on Medium articles with GenAI and Ruby!
](https://blog.devops.dev/parse-medium-articles-with-genai-and-add-some-fun-02fe9d30475a) #GenAI #Medium #Ruby
* 2022-MM-DD [My Mac’s battery🔋 on Google Cloud Monitoring — send SMS if low 🪫](https://medium.com/google-cloud/my-macs-battery-on-google-cloud-monitoring-with-sms-if-its-low-a1ccd70485fe?source=rss-b5293b96912f------2)
* 2023-04-18 [Migrate ☁️ GCP projects across organizations, the gcloud way](https://medium.com/google-cloud/how-to-migrate-projects-across-organizations-c7e254ab90af?source=rss-b5293b96912f------2)
* 2022-02-13 [🐤 Canary Deployment on GCP with Cloud Deploy](https://medium.com/google-cloud/draft-canarying-on-gcp-with-cloud-deploy-91b3e4d0ee9a) #cicd #cloud_deploy #cloud_build #canary This is possibly my longest and most complex demo (took me six months to finalize!) - [video](https://www.youtube.com/watch?v=0GfV5iMGG64) - [code](https://github.com/palladius/clouddeploy-platinum-path) - [step by step guide](https://github.com/palladius/clouddeploy-platinum-path/blob/main/step-by-step-guide.md)
* 2022  [Setting a \u2605 Cloud Build trigger with Pulumi in  Python](https://medium.com/google-cloud/setting-cloudbuild-with-pulumi-in-python-330e8b54b2cf)


Google Cloud Blog:

* [Vodafone: A DevOps approach to AI/ML through cloud-native CI/CD pipelines](https://cloud.google.com/blog/products/devops-sre/how-vodafone-uses-cicd-to-speed-up-ml-pipelines) #MLOps

Videos:

* [Reimagining customer services with GenAI and multi-modal interaction](https://www.youtube.com/watch?v=WRNncVe5yJQ) (George UX Conf, 🇦🇹Vienna)
* [The Art of SLOs ](https://www.youtube.com/watch?v=E3ReKuJ8ewA) - My very first video on Google Cloud! #SRE #SLOs ([More on Art of SLOs](https://sre.google/resources/practices-and-processes/art-of-slos/))


## Sessions

Traveling around the world (..) and delivering sessions on SRE, How Google does Software Development, ..

More info on my talks are in [talks](talks.md).

**2025**

* 2025-10 [Agents on a Plane: A Deep Dive into Building a Real-Time Travel Agent ✈️](https://sessionize.com/app/speaker/session/953469) ([Codemotion, Milan](https://conferences.codemotion.com/milan2025/cfs/)) - *Proposed*.
* 2025-09 A workshop on Create a responsive (Euruko,	🇵🇹Viana do Castelo)  - *Proposed*.
* 2025-03-26 **[SRE Gone Wrong: Top 7 Errors (and How to Avoid Them)](https://2025.cloudconf.it/en/schedule.html)** ([Cloud Conf, 🇮🇹Torino](https://2025.cloudconf.it/))

**2024**

* 2024-11-21 [Keynote: SRE Gone Wrong: Top 7 Errors (and How to Avoid Them)](https://sreday.com/2024-amsterdam/#modal-speaker-0) ([SRE Day, 🇳🇱Amsterdam](https://sreday.com/2024-amsterdam/)) [CfP](https://www.papercall.io/sreday-2024-amsterdam) #SRE #Keynote #Culture
* 2024-11-08 [News Crawler via Langchain.RB and Gemini APIs](https://sessionize.com/app/speaker/session/739236) (GDG Devfest, 🇮🇹Pescara) [CfP](https://sessionize.com/devfest-pescara-2024/) #GenAI #Gemini #Ruby
* 2024-10-12 [News Crawler via Langchain.RB and Gemini APIs](https://sessionize.com/app/speaker/session/745608) (GDG Devfest, 🇮🇹Modena) #GenAI #Gemini #Ruby
* 2024-10-11 [Keynote: Dove l'SRE può andare storto](https://www.devsecopsday.it/talks_speakers/) ([DevSecOps day, 🇮🇹Bologna](https://www.devsecopsday.it/talks_speakers/)) #SRE  #Keynote #Culture
* 2024-09-17 **SRE Jumpstart** (GDG 🇭🇺Budapest, _remote_) #SRE #Culture (soon on Youtube)
* 2024-09-11 [Workshop: Bring your Ruby app in the Cloud](https://2024.euruko.org/speakers/riccardo_carlesso) (Euruko, 🇧🇦Sarajevo) #GenAI #Gemini #Ruby #Keynote
* 2024-08-21 News Crawler via Langchain.RB and Gemini APIs (Railshöck at Puzzle, 🇨🇭Zurich) #GenAI #Gemini #Ruby
* 2024-05-31 News Crawler via Langchain.RB and Gemini APIs ([RubyDay, 🇮🇹Verona](https://2024.rubyday.it/talks_speakers/)) [Sessionize](https://sessionize.com/s/riccardo-carlesso/news-crawler-via-langchainrb-and-gemini-apis/80101) #GenAI #Gemini #Ruby
* 2024-05-29 Software development with Google ([CloudConf, 🇮🇹Turin](https://2024.cloudconf.it/index.html)) #Culture #SWE
* 2024-04-11 Goodbye, deployment headaches: Cloud Deploy and Vertex AI unite (Cloud Next, 🇺🇸Las Vegas)" ([Cloud Next - Abstract](https://cloud.withgoogle.com/next?session=DEV302)) - [video](https://www.youtube.com/watch?v=_NlGk9Ao_oA) - [PDF Slides](https://assets.swoogo.com/uploads/3794522-661c3c8fe0cf9.pdf) #CloudDeploy #MLOps
