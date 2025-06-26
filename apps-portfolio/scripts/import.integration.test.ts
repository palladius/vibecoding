// scripts/import.integration.test.ts
import { exec } from 'child_process';
import { promisify } from 'util';
import { describe, it, expect } from 'vitest';

const execAsync = promisify(exec);

describe('just import', () => {
  it('should run without errors', async () => {
    const { stdout } = await execAsync('just test-import');
    expect(stdout).toContain('Data imported successfully!');
  });
});
