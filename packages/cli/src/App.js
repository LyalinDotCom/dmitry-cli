import React, { useState, useEffect } from 'react';
import { Box, Text, useInput, useApp, Static } from 'ink';
import { Session } from '@dmitry-cli/core';
import { useModelStream } from './hooks/useModelStream.js';
import { ModelSelector } from './components/ModelSelector.js';

const session = new Session();

export function App() {
  const [messages, setMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [selectedModel, setSelectedModel] = useState(null);
  const { exit } = useApp();
  const { isStreaming, streamContent, startStream, currentModel, switchModel, getAvailableModels, error } = useModelStream();

  // Handle slash commands
  const handleSubmit = async (input) => {
    const trimmedInput = input.trim();
    
    // Add user message
    const userMessage = {
      type: 'user',
      content: trimmedInput,
      timestamp: new Date().toLocaleTimeString()
    };
    session.addMessage(userMessage);
    setMessages(prev => [...prev, userMessage]);
    
    // Handle slash commands
    if (trimmedInput.startsWith('/')) {
      const [command, ...args] = trimmedInput.slice(1).split(' ');
      
      switch (command) {
        case 'model':
          if (args.length === 0) {
            // Show current model and available models
            try {
              const models = await getAvailableModels();
              const infoMessage = {
                type: 'info',
                content: `Current model: ${currentModel}\nAvailable models: ${models.join(', ')}`,
                timestamp: new Date().toLocaleTimeString()
              };
              session.addMessage(infoMessage);
              setMessages(prev => [...prev, infoMessage]);
            } catch (err) {
              const errorMessage = {
                type: 'error',
                content: `Error: ${err.message}`,
                timestamp: new Date().toLocaleTimeString()
              };
              session.addMessage(errorMessage);
              setMessages(prev => [...prev, errorMessage]);
            }
          } else {
            // Switch model
            try {
              await switchModel(args[0]);
              const infoMessage = {
                type: 'info',
                content: `Switched to model: ${args[0]}`,
                timestamp: new Date().toLocaleTimeString()
              };
              session.addMessage(infoMessage);
              setMessages(prev => [...prev, infoMessage]);
            } catch (err) {
              const errorMessage = {
                type: 'error',
                content: `Error: ${err.message}`,
                timestamp: new Date().toLocaleTimeString()
              };
              session.addMessage(errorMessage);
              setMessages(prev => [...prev, errorMessage]);
            }
          }
          return;
          
        case 'help':
          const helpMessage = {
            type: 'info',
            content: 'Available commands:\n/model [name] - Switch to a different model\n/model - Show current model and available models\n/help - Show this help message',
            timestamp: new Date().toLocaleTimeString()
          };
          session.addMessage(helpMessage);
          setMessages(prev => [...prev, helpMessage]);
          return;
          
        default:
          const unknownMessage = {
            type: 'error',
            content: `Unknown command: /${command}. Type /help for available commands.`,
            timestamp: new Date().toLocaleTimeString()
          };
          session.addMessage(unknownMessage);
          setMessages(prev => [...prev, unknownMessage]);
          return;
      }
    }
    
    // Regular message - send to model
    await startStream(trimmedInput);
  };
  
  // Update messages when streaming content changes
  useEffect(() => {
    if (streamContent && !isStreaming) {
      // Streaming complete, add the full response
      const assistantMessage = {
        type: 'assistant',
        content: streamContent,
        timestamp: new Date().toLocaleTimeString()
      };
      session.addMessage(assistantMessage);
      setMessages(prev => [...prev, assistantMessage]);
    }
  }, [streamContent, isStreaming]);
  
  // Handle keyboard input
  useInput((input, key) => {
    if (key.ctrl && input === 'c') {
      exit();
      return;
    }

    if (key.return) {
      // Submit message
      if (currentInput.trim()) {
        handleSubmit(currentInput);
        setCurrentInput('');
        setCursorPosition(0);
      }
      return;
    }

    if (key.backspace || key.delete) {
      if (cursorPosition > 0) {
        setCurrentInput(
          currentInput.slice(0, cursorPosition - 1) + 
          currentInput.slice(cursorPosition)
        );
        setCursorPosition(cursorPosition - 1);
      }
      return;
    }

    if (key.leftArrow) {
      setCursorPosition(Math.max(0, cursorPosition - 1));
      return;
    }

    if (key.rightArrow) {
      setCursorPosition(Math.min(currentInput.length, cursorPosition + 1));
      return;
    }

    // Regular character input
    if (input && !key.ctrl && !key.meta) {
      setCurrentInput(
        currentInput.slice(0, cursorPosition) + 
        input + 
        currentInput.slice(cursorPosition)
      );
      setCursorPosition(cursorPosition + input.length);
    }
  });

  // Show model selector if no model is selected yet
  if (!selectedModel) {
    return React.createElement(
      ModelSelector,
      {
        onModelSelected: async (model) => {
          await switchModel(model);
          setSelectedModel(model);
        }
      }
    );
  }
  
  return React.createElement(
    Box,
    { flexDirection: 'column', height: '100%' },
    
    // Header
    React.createElement(
      Box,
      { borderStyle: 'round', borderColor: 'cyan', paddingX: 1 },
      React.createElement(
        Text,
        { bold: true, color: 'cyan' },
        `🚀 Dmitry CLI - Model: ${currentModel} ${isStreaming ? '(thinking...)' : ''}`
      )
    ),
    
    // Message History
    React.createElement(
      Box,
      { flexDirection: 'column', flexGrow: 1, paddingX: 1, paddingY: 1 },
      React.createElement(
        Static,
        { items: messages },
        (message, index) => React.createElement(
          Box,
          { key: index, marginBottom: 1 },
          React.createElement(
            Text,
            { color: message.type === 'user' ? 'green' : message.type === 'assistant' ? 'yellow' : message.type === 'error' ? 'red' : 'cyan' },
            `[${message.timestamp}] ${message.type === 'user' ? 'You' : message.type === 'assistant' ? currentModel : message.type}:`
          ),
          React.createElement(Text, null, ` ${message.content}`)
        )
      ),
      // Show streaming content if active
      isStreaming && streamContent && React.createElement(
        Box,
        { marginBottom: 1 },
        React.createElement(
          Text,
          { color: 'yellow' },
          `[${new Date().toLocaleTimeString()}] ${currentModel}:`
        ),
        React.createElement(Text, null, ` ${streamContent}█`)
      )
    ),
    
    // Input Area
    React.createElement(
      Box,
      { borderStyle: 'single', borderColor: 'gray', paddingX: 1 },
      React.createElement(Text, { color: 'green' }, '> '),
      React.createElement(
        Text,
        null,
        currentInput.slice(0, cursorPosition),
        React.createElement(
          Text,
          { inverse: true },
          currentInput[cursorPosition] || ' '
        ),
        currentInput.slice(cursorPosition + 1)
      )
    ),
    
    // Help text
    React.createElement(
      Box,
      { paddingX: 1 },
      React.createElement(
        Text,
        { dimColor: true },
        'Press Ctrl+C to exit | Type /help for commands'
      )
    )
  );
}