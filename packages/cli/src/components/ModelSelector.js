import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import { OllamaService } from '@dmitry-cli/core';

export function ModelSelector({ onModelSelected }) {
  const [models, setModels] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const ollamaService = new OllamaService();
  
  useEffect(() => {
    const checkOllama = async () => {
      try {
        // Check if Ollama is running
        const isRunning = await ollamaService.isRunning();
        if (!isRunning) {
          setError('Ollama is not running. Please run "ollama serve" first.');
          setLoading(false);
          return;
        }
        
        // Get available models
        const availableModels = await ollamaService.getInstalledModels();
        if (availableModels.length === 0) {
          setError('No models found. Please run "ollama pull llama3.2" to download a model.');
          setLoading(false);
          return;
        }
        
        setModels(availableModels);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    checkOllama();
  }, []);
  
  useInput((input, key) => {
    if (error) return;
    
    if (key.upArrow) {
      setSelectedIndex(Math.max(0, selectedIndex - 1));
    } else if (key.downArrow) {
      setSelectedIndex(Math.min(models.length - 1, selectedIndex + 1));
    } else if (key.return && models.length > 0) {
      onModelSelected(models[selectedIndex].fullName);
    }
  });
  
  if (loading) {
    return React.createElement(
      Box,
      { flexDirection: 'column', paddingX: 2, paddingY: 1 },
      React.createElement(
        Text,
        { color: 'cyan' },
        '⏳ Checking Ollama models...'
      )
    );
  }
  
  if (error) {
    return React.createElement(
      Box,
      { flexDirection: 'column', paddingX: 2, paddingY: 1 },
      React.createElement(
        Text,
        { color: 'red' },
        `❌ Error: ${error}`
      ),
      React.createElement(
        Text,
        { dimColor: true },
        'Press Ctrl+C to exit'
      )
    );
  }
  
  return React.createElement(
    Box,
    { flexDirection: 'column', paddingX: 2, paddingY: 1 },
    React.createElement(
      Text,
      { bold: true, color: 'cyan' },
      '🤖 Select a model to start chatting:'
    ),
    React.createElement(Box, { height: 1 }),
    ...models.map((model, index) => 
      React.createElement(
        Box,
        { key: `${model.fullName}-${index}` },
        React.createElement(
          Text,
          { color: index === selectedIndex ? 'green' : 'white' },
          `${index === selectedIndex ? '▶ ' : '  '}${model.fullName} (${model.size})`
        )
      )
    ),
    React.createElement(Box, { height: 1 }),
    React.createElement(
      Text,
      { dimColor: true },
      'Use ↑↓ to navigate, Enter to select, Ctrl+C to exit'
    )
  );
}