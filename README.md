# Dmitry CLI

A Node.js terminal interface with local model support via Genkit framework and Ollama.

## Features

- 🚀 React-based terminal UI using Ink framework
- 💬 Chat with local models through Ollama
- 🔄 Easy model switching with slash commands
- ⚡ Streaming responses (simulated)
- 🎨 Colorful and interactive interface

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

## Architecture

The project is structured as a monorepo with two main packages:

### `packages/cli`
- Terminal UI using Ink (React for terminals)
- Input handling and display
- Slash command processing

### `packages/core`
- Genkit integration for model communication
- Session management
- Provider abstraction for Ollama

## Configuration

The Genkit provider is configured in `packages/core/src/providers/GenkitProvider.js`:

```javascript
{
  models: [
    { name: 'llama3.2', type: 'generate' },
    { name: 'gemma2', type: 'generate' },
    { name: 'mistral', type: 'generate' },
    { name: 'llama3.1', type: 'generate' }
  ],
  serverAddress: 'http://127.0.0.1:11434' // Ollama default
}
```

## Troubleshooting

### "Cannot connect to Ollama"
Make sure Ollama is running:
```bash
ollama serve
```

### Model not available
Pull the model first:
```bash
ollama pull <model-name>
```

### Build errors
Make sure you're using Node.js v20+:
```bash
node --version
```

## Development

### Project Structure
```
dmitry-cli/
├── packages/
│   ├── cli/           # Terminal UI
│   │   ├── src/
│   │   │   ├── App.js
│   │   │   ├── index.js
│   │   │   └── hooks/
│   │   │       └── useModelStream.js
│   │   └── package.json
│   └── core/          # Core logic
│       ├── src/
│       │   ├── index.js
│       │   └── providers/
│       │       └── GenkitProvider.js
│       └── package.json
├── package.json       # Root package.json
└── README.md
```

### Adding New Models

1. Ensure the model is available in Ollama:
   ```bash
   ollama pull <new-model>
   ```

2. Update the model list in `useModelStream.js`:
   ```javascript
   models: [
     // ... existing models
     { name: 'new-model', type: 'generate' }
   ]
   ```

## Future Enhancements

- [ ] Real streaming support (when Genkit adds it)
- [ ] Model-specific parameters (temperature, max tokens)
- [ ] Conversation history persistence
- [ ] Export conversations
- [ ] Multi-turn context management
- [ ] Tool/function calling support

## License

MIT