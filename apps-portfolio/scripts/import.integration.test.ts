// scripts/import.integration.test.ts
import { exec } from 'child_process';
import { promisify } from 'util';
import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';

const execAsync = promisify(exec);

describe('just import', () => {
  it('should run without errors', async () => {
    const { stdout } = await execAsync('just test-import');
    expect(stdout).toContain('Data imported successfully!');
  });

  it('all talks should have an image', () => {
    const fileContents = fs.readFileSync(path.join(process.cwd(), 'etc', 'data.yaml'), 'utf8');
    const data: any = yaml.load(fileContents);
    data.talks.forEach((talk: any) => {
      expect(talk.image).toBeDefined();
      expect(talk.image).not.toBe('');
      // expect(talk.image).not.toContain('placeholder');
    });
  });

  it('should render the talks page', async () => {
    const { stdout } = await execAsync('curl http://localhost:3001/talks');
    expect(stdout).toContain('Next Talks');
    expect(stdout).toContain('Beyond Blame: The Art of the Postmortem');
  });

  it('should render the tags page with at least GenAI and Gemini', async () => {
    const { stdout } = await execAsync('curl http://localhost:3001/tags');
    expect(stdout).toContain('GenAI');
    expect(stdout).toContain('Gemini');
  });
});
