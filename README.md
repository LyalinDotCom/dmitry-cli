# Dmitry CLI - Genkit + Ollama Demo

A demonstration project showing how to integrate Google's Genkit framework with Ollama for building applications that work with local language models. This sample CLI showcases the integration approach and is inspired by the architecture patterns found in Gemini CLI, though no direct code was used.

## What This Demonstrates

- Integration of Genkit framework with Ollama for local model access
- Dynamic model discovery from Ollama at runtime
- React-based terminal UI using Ink framework
- Clean separation of concerns with monorepo structure
- Model switching and interactive chat capabilities

## Prerequisites

1. **Node.js v20+** - Required for running the CLI
2. **Ollama** - Must be installed and running locally
   ```bash
   # Install Ollama from https://ollama.ai
   # Start Ollama service
   ollama serve
   
   # Pull some models
   ollama pull llama3.2
   ollama pull gemma2
   ```

## Installation

```bash
# Install dependencies
npm install

# Test Ollama connection (optional)
node test-ollama.js

# Run the CLI
npm start
```

## Usage

### Basic Chat
Simply type your message and press Enter to chat with the model.

### Slash Commands

- `/help` - Show available commands
- `/model` - Show current model and list available models
- `/model <name>` - Switch to a different model (e.g., `/model gemma2`)

### Keyboard Shortcuts

- `Enter` - Send message
- `Backspace/Delete` - Delete characters
- `Left/Right Arrow` - Move cursor
- `Ctrl+C` - Exit the application

## How It Works

1. **Model Discovery**: On startup, the CLI queries `ollama list` to find installed models
2. **Model Selection**: Interactive UI allows selecting from available models
3. **Genkit Integration**: Selected model is accessed through Genkit's Ollama plugin
4. **Chat Interface**: Messages are sent to the model and responses are displayed

## Architecture

- **packages/cli**: Terminal UI built with Ink (React for terminals)
- **packages/core**: Genkit integration and Ollama service wrapper

The integration uses Genkit's `generateStream()` method for real-time streaming responses from the models.

## Key Integration Points

### Genkit Provider (`packages/core/src/providers/GenkitProvider.js`)
```javascript
const ai = genkit({
  plugins: [
    ollama({
      models: [{ name: modelName, type: 'generate' }],
      serverAddress: 'http://127.0.0.1:11434',
    }),
  ],
});
```

### Model Discovery (`packages/core/src/providers/OllamaService.js`)
- Executes `ollama list` to get available models
- Parses output to present model selection

## Project Structure
```
dmitry-cli/
├── packages/
│   ├── cli/           # Terminal UI (Ink/React)
│   └── core/          # Genkit + Ollama integration
├── test-ollama.js     # Test script for Ollama connection
└── README.md
```

## Credits

This demo is inspired by the architectural patterns in [Gemini CLI](https://github.com/google-gemini/gemini-cli), particularly the use of Ink for terminal UI and the separation of CLI and core logic. No direct code was used from Gemini CLI.

## License

MIT