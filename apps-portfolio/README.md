# My Portfolio

This is a portfolio application to showcase my talks and demos.

App is live publicly here: https://portfolio-app-272932496670.europe-west1.run.app/

## Installation

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
    > **Note:** The `sqlite3` package requires Python to be installed on your system to compile native extensions. If you encounter errors during `npm install`, please make sure you have a recent version of Python installed.

2.  **Set up Environment:**
    Copy the `.env.dist` file to `.env` and fill in your Google Cloud project ID and region.
3.  **Initialize Google Cloud:**
    Run the following script to enable the necessary Google Cloud APIs:
    ```bash
    ./bin/gcp-init.sh
    ```
4.  **Connect GitHub Repository:**
    Before applying the Terraform configuration, you need to connect your GitHub repository to Google Cloud Build.
    *   Go to the [Cloud Build triggers page](https://console.cloud.google.com/cloud-build/triggers) in the Google Cloud Console.
    *   Click **Connect repository**.
    *   Select **GitHub** as the source.
    *   Follow the on-screen instructions to authorize Google Cloud Build to access your GitHub account and select your repository.

## DB Schema

```mermaid
erDiagram
    TALK {
        int id
        string title
        string event
        string date
        string location
        string country_code
        string session_url
        string video_url
        string slides_url
        string status
        string tags
        string image
        string event_description
        string talk_description
        datetime created_at
        datetime updated_at
    }
    ARTICLE {
        int id
        string title
        string url
        string publish_date
        string tags
        string image
        string resource_type
        string description
        datetime created_at
        datetime updated_at
    }
```

## Development

To get started, run:

```bash
npm install
npm run dev
```

## Deployment

This application is set up for continuous deployment with Google Cloud Build and Cloud Run. See the `cloudbuild.yaml` file for details. The Terraform configuration in the `iac` directory will set up the necessary infrastructure.

## Dependency Graph

```mermaid
graph TD
    subgraph "Application"
        A[portfolio-app]
    end

    subgraph "Dependencies"
        B(next)
        C(react)
        D(react-dom)
        E(sqlite3)
        F(prisma)
        G(typescript)
        H(node-gyp)
        I(python)
    end

    A --> B
    A --> C
    A --> D
    A --> E
    A --> F
    A --> G

    E --> H
    H --> I
```
