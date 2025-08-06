import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Service for interacting with Ollama CLI
 */
export class OllamaService {
  /**
   * Get list of available models from Ollama
   */
  async getInstalledModels() {
    try {
      const { stdout } = await execAsync('ollama list');
      
      // Parse the output - skip the header line
      const lines = stdout.trim().split('\n').slice(1);
      const models = [];
      
      for (const line of lines) {
        if (line.trim()) {
          // Format: NAME                     ID              SIZE      MODIFIED
          const parts = line.split(/\s+/);
          if (parts.length >= 1) {
            const modelName = parts[0];
            // Remove the tag if present (e.g., llama3.2:latest -> llama3.2)
            const cleanName = modelName.split(':')[0];
            models.push({
              name: cleanName,
              fullName: modelName,
              size: parts[2] || 'unknown',
              modified: parts.slice(3).join(' ') || 'unknown'
            });
          }
        }
      }
      
      return models;
    } catch (error) {
      if (error.message.includes('command not found')) {
        throw new Error('Ollama is not installed. Please install from https://ollama.ai');
      }
      throw new Error(`Failed to get Ollama models: ${error.message}`);
    }
  }
  
  /**
   * Check if Ollama is running
   */
  async isRunning() {
    try {
      const { stdout } = await execAsync('ollama ps');
      return true;
    } catch (error) {
      if (error.message.includes('Error: could not connect to ollama app')) {
        return false;
      }
      throw error;
    }
  }
  
  /**
   * Start Ollama service
   */
  async startService() {
    try {
      // This will start ollama in the background
      exec('ollama serve', { detached: true, stdio: 'ignore' });
      
      // Wait a bit for the service to start
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return true;
    } catch (error) {
      throw new Error(`Failed to start Ollama service: ${error.message}`);
    }
  }
}