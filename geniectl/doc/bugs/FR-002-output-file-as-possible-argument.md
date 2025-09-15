Currently I'm having a hard time coding and prompting for gemini cli to create the file with the name that I WANT.

It would be nice to have an optional "output_filename" which gives you the filename.

If the filenam has cardinality 4, like for image, you can simpply and deterministically take:

* "path/to/filename.png"

and rename them to:

* "path/to/filename_1.png"
* "path/to/filename_2.png"
* "path/to/filename_3.png"
* "path/to/filename_4.png"
