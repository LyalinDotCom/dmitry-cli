# Dmitry CLI

A modern terminal CLI application built with React and Ink.

## Quick Start

```bash
# Install dependencies
npm install

# Run the CLI
npm start
```

## Features

- ✅ Terminal UI built with React (Ink)
- ✅ Real-time input handling with cursor support
- ✅ Message history with timestamps
- ✅ Clean monorepo architecture
- ✅ Ready for AI model integration

## Usage

1. Type your message in the input area
2. Press Enter to submit
3. Use arrow keys to move cursor
4. Press Ctrl+C to exit

## Architecture

```
dmitry-cli/
├── packages/
│   ├── core/          # Core business logic
│   └── cli/           # Terminal UI with Ink
└── package.json       # Monorepo configuration
```

## Next Steps

- Add slash commands support
- Integrate AI models
- Add more UI features
- Implement themes