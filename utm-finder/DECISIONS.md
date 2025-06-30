# Decisions

## 2025-06-30 - Added --no-cache flag

**Decision:** Implemented a `--no-cache` command-line flag for `utm_crawler.py` to clear the cache directory before crawling.

**Reasoning:** This provides a simple and effective way for the user to force a cache refresh, ensuring that the latest content is always fetched. Deleting the entire cache directory (`.cache/YYYYMMDD`) on `--no-cache` ensures a clean state and avoids potential issues with stale data.

**Alternatives Considered:**

*   **Bypassing cache without deletion:** This was considered but rejected because it would leave stale data in the cache directory, which could lead to confusion and unexpected behavior. A full deletion ensures a truly fresh state.

**Impact:**

*   Users can now easily clear the cache by running `python3 utm_crawler.py --no-cache` or `just crawl-utms-no-cache`.
*   The `justfile` has been updated with a new recipe (`crawl-utms-no-cache`) for convenience.
