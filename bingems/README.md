# Bingems

This directory contains a collection of binary gems, which are executable scripts that use Gemini to perform various tasks.

## Installation

To install the dependencies for these scripts, run the following command:

```bash
just install
```

## Usage

To run a specific script, use the `just run` command followed by the script name. For example, to run the weather and sport forecaster:

```bash
just run weather_sport_forecaster
```

By default, the script uses Vertex AI for authentication. Make sure you have the `GOOGLE_CLOUD_PROJECT` environment variable set.

