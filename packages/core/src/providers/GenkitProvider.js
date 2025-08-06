import { genkit } from 'genkit';
import { ollama } from 'genkitx-ollama';

/**
 * Provider for interacting with local models via Genkit framework
 */
export class GenkitProvider {
  constructor(config = {}) {
    this.ai = genkit({
      plugins: [
        ollama({
          models: config.models || [],
          serverAddress: config.serverAddress || 'http://127.0.0.1:11434',
        }),
      ],
    });
    
    this.currentModel = config.defaultModel || null;
    this.config = config;
  }

  /**
   * Get list of available models
   */
  async getAvailableModels() {
    try {
      // Return the configured models
      return this.config.models?.map(m => m.name) || [this.currentModel];
    } catch (error) {
      throw new Error(`Failed to get available models: ${error.message}`);
    }
  }

  /**
   * Switch to a different model
   */
  async switchModel(modelName) {
    const available = await this.getAvailableModels();
    if (!available.includes(modelName)) {
      throw new Error(`Model ${modelName} not available. Available models: ${available.join(', ')}`);
    }
    this.currentModel = modelName;
    return { success: true, model: modelName };
  }

  /**
   * Stream a response from the model
   */
  async *streamResponse(prompt, options = {}) {
    try {
      // Use generateStream for real streaming
      const { stream, response } = await this.ai.generateStream({
        model: `ollama/${this.currentModel}`,
        prompt,
        config: {
          temperature: options.temperature ?? 0.7,
          maxOutputTokens: options.maxTokens ?? 2048,
        },
      });

      // Stream chunks as they arrive
      for await (const chunk of stream) {
        if (chunk.text) {
          yield chunk.text;
        }
      }
      
      // Ensure we have the complete response
      await response;
    } catch (error) {
      if (error.message?.includes('ECONNREFUSED')) {
        throw new Error('Cannot connect to Ollama. Make sure Ollama is running on http://127.0.0.1:11434');
      }
      if (error.message?.includes('not found')) {
        throw new Error(`Model '${this.currentModel}' not found. Try running: ollama pull ${this.currentModel.split(':')[0]}`);
      }
      throw error;
    }
  }

  /**
   * Get a single response (non-streaming)
   */
  async generate(prompt, options = {}) {
    try {
      // Use the full model name with tag for Ollama
      const response = await this.ai.generate({
        model: `ollama/${this.currentModel}`,
        prompt,
        config: {
          temperature: options.temperature ?? 0.7,
          maxOutputTokens: options.maxTokens ?? 2048,
        },
      });

      return response.text;
    } catch (error) {
      if (error.message?.includes('ECONNREFUSED')) {
        throw new Error('Cannot connect to Ollama. Make sure Ollama is running on http://127.0.0.1:11434');
      }
      if (error.message?.includes('not found')) {
        throw new Error(`Model '${this.currentModel}' not found. Try running: ollama pull ${this.currentModel.split(':')[0]}`);
      }
      throw error;
    }
  }

  /**
   * Get current model
   */
  getCurrentModel() {
    return this.currentModel;
  }
}