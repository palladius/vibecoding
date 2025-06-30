#!/usr/bin/env tsx

// A script to test fetching future talks from the command line.

import { getFutureTalks } from '../src/app/lib/data';

async function main() {
  console.log('Fetching future talks...');
  try {
    const talks = await getFutureTalks();
    console.log('Future talks:', talks);
    if (talks.length > 0) {
        console.log(`✅ Found ${talks.length} future talks.`);
    } else {
        console.log(`❌ No future talks found.`);
    }
  } catch (error) {
    console.error('Error fetching future talks:', error);
  }
}

main();
