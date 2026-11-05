import { describe, it, expect } from 'vitest';
import { execFileSync } from 'child_process';
import * as path from 'path';

const cliPath = path.resolve(process.cwd(), 'bin', 'portfolio-app-cli');

describe('portfolio-app-cli', () => {
  it('supports --next-events and returns valid JSON with upcoming talks', () => {
    const out = execFileSync(cliPath, ['--next-events', '--as-of', '2026-11-05', '--json'], {
      encoding: 'utf8',
    });
    const parsed = JSON.parse(out);
    expect(parsed.as_of).toBe('2026-11-05');
    expect(Array.isArray(parsed.talks)).toBe(true);
    expect(parsed.talks.length).toBeGreaterThanOrEqual(1);
    expect(parsed.talks[0].event).toContain('HSLU');
    expect(parsed.talks[0].date).toBe('2026-11-27');
  });

  it('gracefully normalizes fuzzy/typoed flags like --next=-evemnts', () => {
    const out = execFileSync(cliPath, ['--next=-evemnts', '--as-of', '2026-11-05', '--no-color'], {
      encoding: 'utf8',
    });
    expect(out).toContain('Upcoming Talks & Events (as of 2026-11-05)');
    expect(out).toContain('HSLU');
  });

  it('supports --stats --json', () => {
    const out = execFileSync(cliPath, ['--stats', '--json'], {
      encoding: 'utf8',
    });
    const stats = JSON.parse(out);
    expect(stats.talks_total).toBeGreaterThanOrEqual(41);
    expect(stats.resources_total).toBeGreaterThanOrEqual(27);
  });
});
