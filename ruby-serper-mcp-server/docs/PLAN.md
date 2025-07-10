# Ruby Serper MCP Server Development Plan

This document outlines the plan to develop a Ruby MCP (Multi-Cloud Platform) Server that exposes Google Flights and Google Hotels data via the SERPER API, with a caching mechanism.

## Table of Contents

1.  [Project Setup](#project-setup)
2.  [SERPER API Integration](#serper-api-integration)
3.  [Caching Mechanism](#caching-mechanism)
4.  [Standalone CLI Tools](#standalone-cli-tools)
5.  [API Endpoints](#api-endpoints)
6.  [Testing](#testing)
7.  [Deployment (Future)](#deployment-future)

## 1. Project Setup

-   [ ] Initialize a new Ruby project (e.g., using `bundler`).
-   [ ] Create a `Gemfile` to manage dependencies.
-   [ ] Add necessary gems: `serpapi` (if available, or a suitable HTTP client like `faraday` and JSON parser), `sinatra` (for a simple web server), `dotenv` (for environment variables).
-   [ ] Set up `.env.dist` for `SERPER_API_KEY` and other configurations.
-   [ ] Create a `justfile` with `install`, `run`, and `test` commands.

## 2. SERPER API Integration

-   [ ] Research and select a Ruby gem for SERPER API interaction, or implement direct HTTP requests.
-   [ ] Implement a client class for Google Flights API calls.
-   [ ] Implement a client class for Google Hotels API calls.
-   [ ] Handle API key authentication.
-   [ ] Implement error handling for API calls (e.g., network issues, API limits).

## 3. Caching Mechanism

-   [ ] Design a caching strategy (e.g., file-based caching under `.cache/`).
-   [ ] Implement a **reusable** cache class/module that stores API responses based on query parameters.
-   [ ] Define cache invalidation logic (e.g., time-based expiry, default 24 hours).
-   [ ] Integrate caching into the SERPER API client classes and standalone CLI tools.

## 4. Standalone CLI Tools

-   [ ] Develop `bin/serper-search-flights.rb` script for Google Flights searches.
    -   [ ] Support command-line options for `from_airport`, `to_airport`, `start_date`, `end_date`, `num_passengers`, `travel_class`.
    -   [ ] Integrate with the reusable caching mechanism to prevent redundant API calls.
-   [ ] Develop `bin/serper-search-hotels.rb` script for Google Hotels searches.
    -   [ ] Support command-line options for `location`, `check_in_date`, `check_out_date`, `num_adults`, `num_children`.
    -   [ ] Integrate with the reusable caching mechanism.

## 5. API Endpoints

-   [ ] Set up a Sinatra (or similar lightweight framework) application.
-   [ ] Define a `/flights` endpoint that accepts parameters (e.g., `from`, `to`, `date`).
-   [ ] Define a `/hotels` endpoint that accepts parameters (e.g., `location`, `check_in_date`, `check_out_date`).
-   [ ] Parse request parameters and pass them to the SERPER API client.
-   [ ] Format API responses into a consistent JSON structure.

## 6. Testing

-   [ ] Write unit tests for SERPER API client classes (mocking API calls).
-   [ ] Write integration tests for API endpoints (using cached responses or a test API key).
-   [ ] Write tests for standalone CLI tools to verify caching behavior.
-   [ ] Ensure `just test` runs all tests.

## 7. Deployment (Future)

-   [ ] (To be defined later) Cloud Build configuration for deployment to Cloud Run.
-   [ ] (To be defined later) Dockerfile for containerization.