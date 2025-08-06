import React, { useState } from 'react';
import { Box, Text, useInput, useApp, Static } from 'ink';
import { Session } from '@dmitry-cli/core';

const session = new Session();

export function App() {
  const [messages, setMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const { exit } = useApp();

  // Handle keyboard input
  useInput((input, key) => {
    if (key.ctrl && input === 'c') {
      exit();
      return;
    }

    if (key.return) {
      // Submit message
      if (currentInput.trim()) {
        const newMessage = {
          type: 'user',
          content: currentInput,
          timestamp: new Date().toLocaleTimeString()
        };
        
        session.addMessage(newMessage);
        setMessages([...messages, newMessage]);
        
        // Echo back for now
        const echoMessage = {
          type: 'assistant',
          content: `You said: "${currentInput}"`,
          timestamp: new Date().toLocaleTimeString()
        };
        
        setTimeout(() => {
          session.addMessage(echoMessage);
          setMessages(prev => [...prev, echoMessage]);
        }, 100);
        
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
        '🚀 Dmitry CLI - Type your message and press Enter'
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
            { color: message.type === 'user' ? 'green' : 'yellow' },
            `[${message.timestamp}] ${message.type === 'user' ? 'You' : 'CLI'}:`
          ),
          React.createElement(Text, null, ` ${message.content}`)
        )
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
        'Press Ctrl+C to exit'
      )
    )
  );
}