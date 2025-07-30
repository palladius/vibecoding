# Implementation Plan

This document outlines the implementation plan for the Real-world Family Travel Agent.

## Phase 1: v1.0 - CLI Application

### 1.1. Core Agent Implementation

- **Objective:** Implement the core logic for each agent.
- **Tasks:**
    - Create the directory structure under `src/agents/` for each agent.
    - Implement the basic prompt and tool setup for each agent using Google ADK.
    - Define the A2A communication interfaces between the Concierge agent and the sub-agents.

### 1.2. Tool Integration

- **Objective:** Integrate the necessary tools for real-world data access.
- **Tasks:**
    - Implement the Airbnb MCP server client.
    - Implement the SERPER API client for flights and hotels.
    - Integrate the `context7` MCP for coding assistance.

### 1.3. CLI Interface

- **Objective:** Create a functional CLI for user interaction.
- **Tasks:**
    - Implement the main CLI application in `src/app-v1/`.
    - Define the commands for initiating a travel request, providing feedback, and approving plans.
    - Implement the display of proposals (flights, hotels, itinerary) in a user-friendly format.

### 1.4. User Preferences

- **Objective:** Implement a mechanism for storing and retrieving user preferences.
- **Tasks:**
    - Create the `etc/user-preferences.yaml` file.
    - Implement the logic for the Family Planner agent to read and use these preferences.

## Phase 2: v2.0 - Web Application

### 2.1. Backend Development

- **Objective:** Create a robust backend for the web application.
- **Tasks:**
    - Set up a Node.js project in `src/app-v2/`.
    - Implement a RESTful API for the frontend to interact with the agent system.
    - Set up a database (SQLite for development, with a clear path to PostgreSQL for production).

### 2.2. Frontend Development

- **Objective:** Create a user-friendly web interface.
- **Tasks:**
    - Choose a frontend framework (e.g., React, Vue).
    - Implement the UI for submitting travel requests, viewing proposals, and providing feedback.
    - Implement the map view for hotel selection.

### 2.3. User Authentication

- **Objective:** Implement user authentication for personalized experiences.
- **Tasks:**
    - Add a login system to the web application.
    - Store and manage user preferences in the database.

## Phase 3: Infrastructure and Deployment

### 3.1. Infrastructure as Code (IaC)

- **Objective:** Manage cloud resources using IaC.
- **Tasks:**
    - Create Terraform or Pulumi scripts in the `iac/` directory to define the necessary GCP resources (e.g., service accounts, Artifact Registry, Cloud Build triggers).

### 3.2. Continuous Integration and Deployment (CI/CD)

- **Objective:** Automate the build, test, and deployment process.
- **Tasks:**
    - Create a `cloudbuild.yaml` file for each project.
    - Set up a Cloud Build trigger to automatically deploy the application on pushes to the main branch.
