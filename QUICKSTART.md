# Dmitry CLI - Quick Start Guide

## What We Built

We've created a terminal-based chat interface that:
1. Queries Ollama on startup to find available local models
2. Shows a model selector UI with arrow key navigation
3. Uses Genkit framework to communicate with the selected model
4. Provides an interactive chat experience with slash commands

## Key Components

### 1. **OllamaService** (`packages/core/src/providers/OllamaService.js`)
- Executes `ollama list` to get installed models
- Checks if Ollama service is running
- Provides model discovery at startup

### 2. **GenkitProvider** (`packages/core/src/providers/GenkitProvider.js`)
- Uses Genkit framework with Ollama plugin
- Handles model switching and generation
- Configured to use `http://127.0.0.1:11434` (Ollama default)

### 3. **ModelSelector** (`packages/cli/src/components/ModelSelector.js`)
- Shows available models from Ollama
- Arrow key navigation
- Error handling for when Ollama isn't running

### 4. **Main App** (`packages/cli/src/App.js`)
- Shows ModelSelector on startup
- Once model is selected, switches to chat interface
- Supports slash commands:
  - `/help` - Show available commands
  - `/model` - Show current model
  - `/model <name>` - Switch models

## Architecture Flow

```
1. App starts → ModelSelector component loads
2. OllamaService queries `ollama list` 
3. User selects model with arrow keys + Enter
4. GenkitProvider initializes with selected model
5. Chat interface becomes active
6. Messages are sent through Genkit → Ollama → Model
```

## Fixes Applied

1. **Import Path Errors**: Fixed `@dmitry-cli/core/providers/...` to use the main export
2. **Build Script**: Added dummy build script to CLI package.json
3. **Model Selection**: Made provider initialization dynamic based on selected model
4. **Error Handling**: Added checks for Ollama service status

## Testing

```bash
# Check if Ollama is working
node test-ollama.js

# Start the app
npm start
```

## What Happens When You Run It

1. The app checks if Ollama is running
2. Lists all installed models (from `ollama list`)
3. You select a model using arrow keys
4. Chat interface opens with the selected model
5. Type messages to chat, use `/help` for commands

## Important Notes

- Genkit doesn't support streaming out of the box, so responses are simulated as streaming
- The app requires Ollama to be running (`ollama serve`)
- At least one model must be installed (`ollama pull llama3.2`)