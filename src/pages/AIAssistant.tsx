import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Send, Paperclip, Bot, User, FileText, Globe, TrendingUp, Sparkles, Award, Landmark, Calculator, GraduationCap, Users, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface SuggestedQuestion {
  id: string;
  question: string;
  category: string;
  icon: string;
  priority: number;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
  Globe,
  TrendingUp,
  Sparkles,
  Award,
  Landmark,
  Calculator,
  GraduationCap,
  Users,
  Search,
};

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: "Hello! I'm your GTPC AI Trade Assistant. I can help you with:\n\n• **Government Schemes** – Find and understand export-import subsidies\n• **Buyer Discovery** – Connect with international buyers\n• **Documentation** – Navigate compliance requirements\n• **Trade Guidance** – Get step-by-step export guidance\n\nHow can I assist you today?",
    timestamp: new Date(),
  },
];

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch suggested questions from database
  const { data: suggestedQuestions = [] } = useQuery({
    queryKey: ['ai-suggested-questions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_suggested_questions')
        .select('id, question, category, icon, priority')
        .eq('is_active', true)
        .order('priority', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data as SuggestedQuestion[];
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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
        content: "Thank you for your question. I'm processing your request.\n\nThis is a demo response – in the full implementation, I would connect to the AI backend to provide detailed, context-aware answers about trade schemes, buyer discovery, and export-import guidance.\n\nWould you like me to help you with anything specific about government schemes or buyer connections?",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handlePromptClick = async (questionId: string, prompt: string) => {
    setInput(prompt);
    
    // Track click in database (fire and forget - increment click_count)
    try {
      const { data } = await supabase
        .from('ai_suggested_questions')
        .select('click_count')
        .eq('id', questionId)
        .single();
      
      if (data) {
        await supabase
          .from('ai_suggested_questions')
          .update({ click_count: (data.click_count || 0) + 1 })
          .eq('id', questionId);
      }
    } catch {
      // Silent fail - analytics shouldn't break UX
    }
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">AI Trade Assistant</h1>
            <p className="text-xs text-muted-foreground">
              Ask questions about schemes, buyers, documentation, and trade guidance
            </p>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <Card className="flex-1 border shadow-sm flex flex-col overflow-hidden">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4 max-w-2xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-3',
                  message.role === 'user' ? 'flex-row-reverse' : ''
                )}
              >
                <div className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                  message.role === 'assistant' ? 'bg-primary/10' : 'bg-muted'
                )}>
                  {message.role === 'assistant' ? (
                    <Bot className="h-4 w-4 text-primary" />
                  ) : (
                    <User className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className={cn(
                  'rounded-lg px-4 py-3 max-w-[85%] text-sm',
                  message.role === 'assistant' 
                    ? 'bg-muted/50 border border-border' 
                    : 'bg-primary text-primary-foreground'
                )}>
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-muted/50 border border-border rounded-lg px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Suggested Prompts */}
        {messages.length === 1 && suggestedQuestions.length > 0 && (
          <div className="px-4 pb-3 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2 pt-3 font-medium">Suggested questions:</p>
            <div className="flex flex-wrap gap-2 max-w-2xl mx-auto">
              {suggestedQuestions.map((suggestion) => {
                const IconComponent = ICON_MAP[suggestion.icon] || Sparkles;
                return (
                  <Button
                    key={suggestion.id}
                    variant="outline"
                    size="sm"
                    className="text-xs h-8 bg-background hover:bg-muted"
                    onClick={() => handlePromptClick(suggestion.id, suggestion.question)}
                  >
                    <IconComponent className="h-3 w-3 mr-1.5" />
                    {suggestion.question.length > 50 
                      ? suggestion.question.substring(0, 50) + '...' 
                      : suggestion.question}
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {/* Input Area */}
        <CardContent className="border-t border-border p-4 bg-muted/30">
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-2 items-end">
              <Button variant="ghost" size="icon" className="shrink-0 h-9 w-9 text-muted-foreground hover:text-foreground">
                <Paperclip className="h-4 w-4" />
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
                  className="min-h-[44px] max-h-32 resize-none text-sm bg-background border-border"
                  rows={1}
                />
              </div>
              <Button 
                size="icon" 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="shrink-0 h-9 w-9"
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
