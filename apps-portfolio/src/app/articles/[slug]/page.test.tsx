// src/app/articles/[slug]/page.test.tsx
import { getArticle } from '../../lib/data';

describe('ArticlePage', () => {
  it('should return an article for a valid slug', async () => {
    const article = await getArticle('2020-12-31-the-art-of-slos');
    expect(article).toBeDefined();
    expect(article?.title).toBe('The Art of SLOs');
  });

  it('should return undefined for an invalid slug', async () => {
    const article = await getArticle('invalid-slug');
    expect(article).toBeUndefined();
  });
});
