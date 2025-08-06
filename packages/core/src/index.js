// Core functionality will go here
export const VERSION = '1.0.0';

export class Session {
  constructor() {
    this.messages = [];
  }

  addMessage(message) {
    this.messages.push({
      ...message,
      timestamp: new Date().toISOString()
    });
  }

  getHistory() {
    return [...this.messages];
  }

  clear() {
    this.messages = [];
  }
}

// Export providers
export { GenkitProvider } from './providers/GenkitProvider.js';
export { OllamaService } from './providers/OllamaService.js';