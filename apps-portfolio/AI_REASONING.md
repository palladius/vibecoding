
## Cloud Build Version Tagging Wisdom (2025-06-12)

Learned a crucial lesson regarding robust Docker image version tagging in Cloud Build, especially for GitHub-triggered builds.

**Problem:**
- Relying on Cloud Build's `substitutions` for custom variables (like `_VERSION`) and the `images` stanza for versioned tags is unreliable for automatic GitHub triggers.
- The `images` stanza primarily declares images built, not explicitly tags/pushes custom versioned tags based on dynamic `VERSION` files.

**Solution (Riccardo's Wisdom):**
- Implement version tagging and pushing directly within a dedicated `bash` step in `cloudbuild.yaml`.
- This step should be placed between the `Push` (of `latest`) and `Deploy` stages.
- **Key Commands:**
    - Read the `VERSION` file directly: `VERSION=$(cat VERSION)`
    - Tag the `latest` image with the version: `docker tag europe-west1-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/portfolio-app:latest europe-west1-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/portfolio-app:v$VERSION`
    - Push the versioned tag: `docker push europe-west1-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/portfolio-app:v$VERSION`
- This approach ensures:
    - Compatibility with GitHub triggers (no reliance on manual `--substitutions`).
    - Explicit control over tagging and pushing.
    - Both `latest` and `v<VERSION>` tags exist in Artifact Registry.
    - The actions are fast as they leverage the same underlying image layers (like creating a symlink).

**Note:** While ideally `v<VERSION>` would be created first and `latest` later, the current setup works with an existing `latest` image, and this order is acceptable for now.

## Video Resource Type and Custom Schema Addition (2026-06-24)

### Problem:
- Riccardo wanted to add Videos as a first-class resource type in his portfolio.
- He wanted to support rich features:
  - Custom CTAs (specific text & links).
  - Presentation slides links (`slides_url`).
  - Buganizer bugs (`bug_id`) linked to issuetracker.google.com.
  - Descriptions formatted with Markdown.
  - Additional related links (with optional custom emojis, defaulting to `🔹`).
  - Optional thumbnails that dynamically fallback to standard YouTube thumbnail patterns (`https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg`) if not explicitly provided.
  - Video items should live in a separate file (`etc/videos.yaml`) for easier maintainability and conflict-free git rebases.
  - Added a `relevance` rating (1-10) to help filter or sort entries.

### Solution:
- **Database Schema**: Updated Prisma `Article` model with optional fields: `slides_url`, `bug_id`, `cta_text`, `cta_url`, `links` (JSON string), and `relevance` (Int). Synced using `prisma db push`.
- **YouTube Parsing**: Made the regex in `extractYouTubeVideoId` in `src/lib/utils.ts` robust to query parameters (like `&list=...` and `&index=1`), ensuring it doesn't crash on standard playlist URLs.
- **YAML Split**: Updated `import-yaml.ts` to look for both `etc/data.yaml` and `etc/videos.yaml` (if present), merge the parsed lists, and write them dynamically to the `Article` database model.
- **Dynamic Thumbnails**: If the `image` field is not provided, `ArticleCard` automatically extracts the YouTube Video ID from `video_url` and retrieves `https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg` for a clean loading card state.
- **Markdown Descriptions**: Custom regex-based Markdown renderer added directly to `ArticlePage` component to format `**bold**`, `*italics*`, and `` `code` `` tags cleanly without needing dynamic npm parsers.
- **Custom Links & CTAs**: Link list JSON parsed and mapped dynamically in details page using custom emojis or `🔹`.

## Rails-style Videos Index vs Show Routes (2026-06-24)

### Problem:
- Riccardo requested a Rails-like index/show approach for videos.
- Clicking on a video image or title should navigate to a detailed video show page rather than the generic `/articles/[slug]`.

### Solution:
- **Routes**: Created a dynamic route at `/videos/[slug]` to render detailed information specifically for videos (fetching with `getArticle(slug)` and confirming `resource_type === 'video'`).
- **Global Navigation**: Added `/videos` ("Videos") to the navbar in `src/app/layout.tsx`.
- **Dynamic Linking**: Updated `ArticleCard.tsx` and `ListView.tsx` to conditionally route to `/videos/[slug]` if `resource_type === 'video'`, and `/articles/[slug]` otherwise.
- **Improved UX**: Added clean `← Back to Videos` / `← Back to Articles` / `← Back to Talks` navigation links on the respective details/show pages to make navigation super smooth.
- **Build & Quality**: Verified that the entire project builds successfully with `DATABASE_URL` set, and ran `npm run lint` with 0 warnings/errors.


