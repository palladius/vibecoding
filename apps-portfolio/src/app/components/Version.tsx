
import fs from 'fs';
import path from 'path';

export function getVersion() {
  const version = fs.readFileSync(path.join(process.cwd(), 'VERSION'), 'utf8').trim();
  return version;
}
