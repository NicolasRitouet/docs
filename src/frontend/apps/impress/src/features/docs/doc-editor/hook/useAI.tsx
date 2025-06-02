import { createOpenAI } from '@ai-sdk/openai';
import { createAIExtension, createBlockNoteAIClient } from '@blocknote/xl-ai';
import { useMemo } from 'react';

import { fetchAPI } from '@/api';

import { Doc } from '../../doc-management';

const client = createBlockNoteAIClient({
  baseURL: ``,
  apiKey: '',
});

export const useAI = (docId: Doc['id']) => {
  return useMemo(() => {
    const openai = createOpenAI({
      ...client.getProviderSettings('openai'),
      fetch: (input, init) => {
        // Create a new headers object without the Authorization header
        const headers = new Headers(init?.headers);
        headers.delete('Authorization');

        return fetchAPI(`documents/${docId}/ai-proxy/`, {
          ...init,
          headers,
        });
      },
    });
    const model = openai.chat('neuralmagic/Meta-Llama-3.1-70B-Instruct-FP8');

    const extension = createAIExtension({
      stream: false,
      model,
      agentCursor: {
        name: 'Albert',
        color: '#8bc6ff',
      },
    });

    return extension;
  }, [docId]);
};
