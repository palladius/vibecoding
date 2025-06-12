import { NextResponse } from 'next/server';
import fs from 'fs';
import yaml from 'js-yaml';

export async function GET() {
  const fileContents = fs.readFileSync('etc/data.yaml', 'utf8');
  const data = yaml.load(fileContents) as { bio: string };
  return NextResponse.json(data);
}
