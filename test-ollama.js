#!/usr/bin/env node
import { OllamaService } from './packages/core/src/providers/OllamaService.js';

console.log('Testing Ollama integration...\n');

const ollama = new OllamaService();

try {
  // Check if Ollama is running
  const isRunning = await ollama.isRunning();
  console.log(`✓ Ollama running: ${isRunning}`);
  
  if (!isRunning) {
    console.log('\n❌ Ollama is not running.');
    console.log('Please start Ollama with: ollama serve');
    process.exit(1);
  }
  
  // Get installed models
  const models = await ollama.getInstalledModels();
  console.log(`\n✓ Found ${models.length} models:`);
  
  models.forEach(model => {
    console.log(`  - ${model.name} (${model.size})`);
  });
  
  if (models.length === 0) {
    console.log('\n❌ No models installed.');
    console.log('Install a model with: ollama pull llama3.2');
  }
  
} catch (error) {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
}