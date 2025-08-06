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
          models: config.models || [
            { name: 'llama3.2', type: 'generate' },
            { name: 'gemma2', type: 'generate' }
          ],
          serverAddress: config.serverAddress || 'http://127.0.0.1:11434',
        }),
      ],
    });
    
    this.currentModel = config.defaultModel || 'llama3.2';
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
      const response = await this.ai.generate({
        model: `ollama/${this.currentModel}`,
        prompt,
        config: {
          temperature: options.temperature ?? 0.7,
          maxOutputTokens: options.maxTokens ?? 2048,
        },
      });

      // Genkit doesn't support streaming by default, so we'll yield the full response
      // In a real implementation, we'd use streamGenerate if available
      yield response.text;
    } catch (error) {
      if (error.message?.includes('ECONNREFUSED')) {
        throw new Error('Cannot connect to Ollama. Make sure Ollama is running on http://127.0.0.1:11434');
      }
      throw error;
    }
  }

  /**
   * Get a single response (non-streaming)
   */
  async generate(prompt, options = {}) {
    try {
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