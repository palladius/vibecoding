We need to ensure these pages return 200. I'll give you both

# Testable URLs

This file contains a list of URLs that should be tested to ensure the application is working correctly.

These are ALL the Endpoints we want to monitor:

- /talks/
- /talks/2025-11-15-beyond-blame-the-art-of-the-postmortem
- /articles/2021-01-01-the-art-of-slos
- /articles/
- /about/

Locally, we want to test:

*  Locally: http://localhost:3001/ENDPOINT
*  Remotely (PROD): https://portfolio-app-272932496670.europe-west1.run.app/ENDPOINT

For both, you can just execute with Bash Tool `curl http://localhost:3001/...` or `curl https://portfolio-app-272932496670.europe-west1.run.app/...`. Sometimes, if we're running the docker container in localhost on port 8080, you can also `curl http://localhost:8080/...`
