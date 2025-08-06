import { useState, useCallback, useRef } from 'react';
import { GenkitProvider } from '@dmitry-cli/core';

export function useModelStream(initialModel = null) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamContent, setStreamContent] = useState('');
  const [currentModel, setCurrentModel] = useState(initialModel || 'llama3.2');
  const [error, setError] = useState(null);
  const providerRef = useRef(null);

  // Initialize provider when model is selected
  const initializeProvider = useCallback((modelName) => {
    providerRef.current = new GenkitProvider({
      defaultModel: modelName,
      models: [
        { name: modelName, type: 'generate' }
      ]
    });
  }, []);

  const switchModel = useCallback(async (modelName) => {
    try {
      setError(null);
      // Reinitialize provider with new model
      initializeProvider(modelName);
      setCurrentModel(modelName);
      return { success: true, model: modelName };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [initializeProvider]);

  const getAvailableModels = useCallback(async () => {
    try {
      setError(null);
      if (!providerRef.current) {
        return [];
      }
      return await providerRef.current.getAvailableModels();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const startStream = useCallback(async (input) => {
    if (!providerRef.current) {
      setError('No model selected');
      return;
    }
    
    setIsStreaming(true);
    setStreamContent('');
    setError(null);

    try {
      // For now, use non-streaming generate since Genkit doesn't support streaming out of the box
      const response = await providerRef.current.generate(input);
      
      // Simulate streaming for better UX
      for (let i = 0; i < response.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 10));
        setStreamContent(prev => prev + response[i]);
      }
    } catch (err) {
      setError(err.message);
      setStreamContent(`Error: ${err.message}`);
    } finally {
      setIsStreaming(false);
    }
  }, []);

  return {
    isStreaming,
    streamContent,
    startStream,
    currentModel,
    switchModel,
    getAvailableModels,
    error,
  };
}