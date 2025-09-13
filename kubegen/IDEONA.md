## Idea

I just had the best idea ever for a kubernetes/LLM thing.

## Problem

Sometimes I want to create a complex structure/array of things which contain serveral:
* Images
* videos
* stories/texts/markdowns
* Musics
* ...

they all are generated using some Google API and, more importantly, they all take time.

they usually start with prompts (I have a video prompt, an image prompt and so on).
And the API produces an array of solutions (image1..image4, video1..video4 and so on.)

I would like to have a tool which takes these "inputs" like
* 4 takes of Video with prompt "fun video of a cat".

and with some sort of `kubectl apply` creates the 4 videos.
Most importantly, if I call it a second time, it should return 0 and do NOTHING if the 4 files are available.
It should contain a target_folder somewhere in the stanza.


## Solution

I'd like to create an application, in whichever language you prefer (possibly ruby but Im ok with go/python/..), which:

1. Defines the structure of these YAMLs. It should be similar to kubernetes and support multiple Kinds.
2. Simple Kinds should be at least *Video*, **Image**, **Music**, **Audio**, **Markdown** (the simplest generation from prompt to markdown, you can find a better name, like 'Generation' or 'Text').
3. There should be more complex "arrays" of these original stuff. For instance I can think of:
   1. A **StoryBoard** which represents a real movie made of an array of **Scenes** plus some metadata.
   2. A **Scene** (or StoryScene) which represents an array of N Video takes, possibly a subtitle (string with positioning/coloring), possibly a Music, possibly a Audio, and possibly a "voiceover text" argument which can become an Audio once actuated.
4. We can start by creating a sample `etc/sample_story.yaml` and build the software form this example.
5. Ideally we should be able to create **dependencies**, like "this image has a prompt which points to the solution to this story input prompt", meaning that first we need to have LLM take storyprompt -> story.md and then use the output of that as an input, maybe with some `$ kube_object.output_file` ot similar.

Now I'm not sure how to do it, but once the config file has been actuated additional values need to be added somewhere (eg solution_image_1234 have been created and i have an array of 4 output files).
* We can either put them in the YAML itself under some `output` stanza, or create a secondary deterministic file, like "input_file.yaml" -> "input_file.hydrated.yaml" so the script can check if we already have the output and we can skip.
* Finally the system should have a way to check if the prompt/input has changed, like an `md5(input)` so if I change even one word of the input, it should regenerate the output (and so in cascade for dependants).

## Kind metdatada

All kinds should have a common YAML representation, the `k8s` way, with a `name` which defines them uniquely in the namespace/folder, and `tags` to apply things to sub-thingies.
They should all support a number of similar names, as we don't want to repeat ourselves too much.
* Every API will have some options, for example a `chirp` model for audio will support a voice. this is fine, and we're going to enrich this as we go deeper in a specific API, but we start simple, assuming reasonable defaults (eg, language = 'en' , voice = whatever).
* Lets keep similar semantics across APIs with a consistent names. For example, the cardinality of output images/videos is important. We can default to 4 for images and 2 for videos, 2 for music and 1 for audio but we need to identify a common word, like "replicas: 4" or "cardinality: 4". Choose something a kubernetes person would choose.

## Non functional requirements

1. Create a folder with proper/funny codename, and in it put an extensive PLAN.md with bulletpoints. DO NOT WRITE ANY CODE.
2. Write a `etc/sample_story.yaml` with a few sample stanzas (one for a bedtime story generation, one for its image).
3. Since this is a complex thing, I need extensive Unit Testing to cover a few things, in particular
   1. Dependencies.
   2. generation of any single basic type (image, video, audio, ..)
   3. generation of complex things (array/).
4. Bonus point if this works WITH kubectl in the end, but that's not important for v1.
