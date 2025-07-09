#!/bin/bash
git commit -m 'feat: Implement API for all talks and fix talk/article pages

This commit introduces a new API endpoint `/api/all-talks` to serve all talk data, resolving the
    client-side Prisma error on the `/talks` page. The `/talks` page now fetches data from this new API
    route.

Additionally, this commit fixes the rendering of individual talk and article pages by ensuring
    correct data fetching and slug generation.'
