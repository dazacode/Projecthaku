import { useState } from 'react';
import { generateChatResponse } from '@/lib/gemini';
import { toast } from 'sonner';

export function useChat() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      setIsLoading(true);
      const response = await generateChatResponse(input);
      // Handle the response - you'll need to implement this based on your UI needs
      setInput('');
    } catch (error) {
      console.error('Error generating response:', error);
      toast.error('Failed to generate response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    input,
    isLoading,
    handleInputChange,
    handleSubmit,
  };
}
