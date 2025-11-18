// src/lib/server-polyfills.ts

// Forcefully mock localStorage for server-side rendering
// This is an aggressive approach to ensure localStorage is always defined
// in the Node.js environment, even if other mechanisms fail.
global.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {}, // Corrected syntax here
  length: 0,
  key: () => null,
};