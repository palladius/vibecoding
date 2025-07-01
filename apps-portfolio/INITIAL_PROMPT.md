I am riccardo Carlesso and I work in Google Cloud as a Developer Advocate. My job is to create demo apps, do presentations and participate at events.

I would like to create a shiny "Portfolio" application in JS and whatever. this portfolio should highlight my **demos** and **talks**.
Since a talk can have a demo, we need to conflate both objects in a similar Blob. We'll use GCP Firestore for schemaless data,
so we can iterate fast on data without having to adhere to a strong schema.

I'm a Ruby on Rails developer so I think in Rails terms, as you can see.


## Functional requirements.

* Just to make sure we navigate well through vibe coding, let's ensure all document 'leaves' have a schema_version (so we have the ability to add both to documentation or in code something like "field xyz is available since v1.2.3" or "field abc was renamed abd in v2.3.4").
* The app shall be built with Cloud Build and pushed to Cloud run. It will be visible to everyone.
* The app should have a visual appeal and a wow factor. do not hesitate to add flashy JS libraries to make flashy colorful transitions. Note this app is both a serious portfolio app and a demo, so I do care about the wow factor more than having a lean/fast-loading JS since it's not going to have 1000 QPS :)

## Database

* The DB shall have two entities: **talks** and **events**.
* Read `../GEMINI.md` for additional generic requirements for my coding preferences. when in conflict, *THIS* doc wins.
* The code should be testable with sqlite3 in localhost for ease, and connect to Firebase in production. Some jobs to push/pull/sync from local sqlite to firebase would be nice to have.

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

## Code

I'm no javascript expert. Try to use more libraries and less custom code, when possible.

# Samples Data

I'm going to paste here some talks I've done in the past so you can "seed"
