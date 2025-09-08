# ElectroBanana Development Plan

This document outlines the steps to build the ElectroBanana application.

## Phase 1: Project Setup & Basic UI

- [x] Create `package.json`
- [ ] Create `PLAN.md` (this file)
- [ ] Create `.gitignore`
- [ ] Install Electron
- [ ] Create `main.js` (main process)
- [ ] Create `index.html` (UI)
- [ ] Create `renderer.js` (renderer process)
- [ ] Create a basic "Hello World" Electron app to ensure the setup is working.

## Phase 2: Core Functionality

- [ ] Implement the basic UI with two image placeholders and a text input for the prompt.
- [ ] Implement logic to receive image paths from the command line or context menu.
- [ ] Implement the logic to call the Gemini API with the two images and the prompt.
- [ ] Display the resulting image in the UI.

## Phase 3: Context Menu Integration

- [ ] Research and implement context menu integration for macOS.
- [ ] Research and implement context menu integration for Linux.
- [ ] Research and implement context menu integration for Windows.

## Phase 4: Polishing and Packaging

- [ ] Securely store the `GEMINI_API_KEY`.
- [ ] Implement a way to set the `DEFAULT_PROMPT`.
- [ ] Package the application for macOS.
- [ ] Package the application for Linux.
- [ ] Package the application for Windows.
- [ ] Address the issue of managing large executables (e.g., using Git LFS).
