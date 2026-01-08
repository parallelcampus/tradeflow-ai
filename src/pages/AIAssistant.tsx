import { useState } from 'react';
import { Send, Paperclip, Mic, Bot, User, Sparkles, FileText, Globe, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const suggestedPrompts = [
  { icon: FileText, text: 'What schemes are available for electronics exporters?' },
  { icon: Globe, text: 'How do I find buyers in Southeast Asia?' },
  { icon: TrendingUp, text: 'Explain the PLI scheme benefits' },
];

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: "Hello! I'm your GTPC AI Trade Assistant. I can help you with:\n\n• **Government Schemes** - Find and understand export-import subsidies\n• **Buyer Discovery** - Connect with international buyers\n• **Documentation** - Navigate compliance requirements\n• **Trade Guidance** - Get step-by-step export guidance\n\nHow can I assist you today?",
    timestamp: new Date(),
  },
];

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response (replace with actual AI integration)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Thank you for your question! I'm processing your request. This is a demo response - in the full implementation, I would connect to the AI backend to provide detailed, context-aware answers about trade schemes, buyer discovery, and export-import guidance.\n\nWould you like me to help you with anything specific about government schemes or buyer connections?",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-display font-bold flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          AI Trade Assistant
        </h1>
        <p className="text-muted-foreground">
          Ask questions about schemes, buyers, documentation, and trade guidance
        </p>
      </div>

      {/* Chat Container */}
      <Card className="flex-1 border-border/50 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 max-w-3xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-3',
                  message.role === 'user' ? 'flex-row-reverse' : ''
                )}
              >
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                  message.role === 'assistant' ? 'bg-primary' : 'bg-muted'
                )}>
                  {message.role === 'assistant' ? (
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  ) : (
                    <User className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className={cn(
                  'rounded-2xl px-4 py-3 max-w-[80%]',
                  message.role === 'assistant' 
                    ? 'bg-muted/50' 
                    : 'bg-primary text-primary-foreground'
                )}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="bg-muted/50 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Suggested Prompts */}
        {messages.length === 1 && (
          <div className="px-4 pb-4">
            <div className="flex flex-wrap gap-2 max-w-3xl mx-auto">
              {suggestedPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => handlePromptClick(prompt.text)}
                >
                  <prompt.icon className="h-3 w-3 mr-1" />
                  {prompt.text}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <CardContent className="border-t border-border/50 p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-2 items-end">
              <Button variant="ghost" size="icon" className="shrink-0">
                <Paperclip className="h-5 w-5" />
              </Button>
              <div className="flex-1 relative">
                <Textarea
                  placeholder="Ask about schemes, buyers, documentation..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  className="min-h-[44px] max-h-32 resize-none pr-12"
                  rows={1}
                />
              </div>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Mic className="h-5 w-5" />
              </Button>
              <Button 
                size="icon" 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
