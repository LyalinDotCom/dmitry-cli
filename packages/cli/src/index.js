#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import { App } from './App.js';

// Render the terminal UI
const { unmount } = render(React.createElement(App));

// Handle graceful shutdown
process.on('SIGTERM', () => {
  unmount();
  process.exit(0);
});

process.on('SIGINT', () => {
  unmount();
  process.exit(0);
});