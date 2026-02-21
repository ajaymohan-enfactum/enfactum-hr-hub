import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HandbookChunk } from '@/types/hr';
import { useToast } from '@/hooks/use-toast';
import { Send, BookOpen, Ticket, ShieldAlert } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  chunks?: HandbookChunk[];
  showEscalate?: boolean;
  query?: string;
}

const suggestedQuestions = [
  'How do I submit an expense claim?',
  'What is the PTO policy?',
  'What are the remote work security rules?',
  'When is payday?',
  'What are the procurement thresholds?',
  'How do I report harassment?',
];

const AskHR = () => {
  const { currentUser } = useAuth();
  const { searchHandbook, setTickets, tickets } = useData();
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (query?: string) => {
    const q = query || input.trim();
    if (!q) return;
    setInput('');

    const userMsg: Message = { id: `msg-${Date.now()}`, role: 'user', content: q };
    const chunks = searchHandbook(q);
    const isHarassment = q.toLowerCase().includes('harassment') || q.toLowerCase().includes('grievance');

    let assistantMsg: Message;
    if (chunks.length > 0) {
      const answer = chunks.map(c => c.chunk_text).join('\n\n');
      assistantMsg = {
        id: `msg-${Date.now() + 1}`, role: 'assistant',
        content: answer, chunks, showEscalate: isHarassment, query: q,
      };
    } else {
      assistantMsg = {
        id: `msg-${Date.now() + 1}`, role: 'assistant',
        content: "I'm not sure about that. I couldn't find relevant information in the employee handbook. Would you like me to raise this with HR?",
        showEscalate: true, query: q,
      };
    }
    setMessages(prev => [...prev, userMsg, assistantMsg]);
  };

  const handleCreateTicket = (question: string, isPrivate: boolean = false) => {
    const newTicket = {
      id: `TKT-${String(tickets.length + 1).padStart(3, '0')}`,
      requester_id: currentUser.id,
      ticket_type: isPrivate ? 'harassment' as const : 'policy_question' as const,
      subject: question.slice(0, 100),
      description: `Question from Ask HR: ${question}`,
      status: 'open' as const,
      assigned_to: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      private_flag: isPrivate,
    };
    setTickets(prev => [...prev, newTicket]);
    toast({ title: 'HR Ticket created', description: `${newTicket.id} has been submitted to HR.` });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Ask HR</h1>
        <p className="text-muted-foreground text-sm">Search the employee handbook or ask a question</p>
      </div>

      {messages.length === 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">Suggested questions</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {suggestedQuestions.map(q => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="text-left p-3 rounded-lg border border-border hover:border-accent hover:bg-accent-muted transition-colors text-sm text-foreground"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4 min-h-[200px]">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'}`}>
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              {msg.chunks && msg.chunks.length > 0 && (
                <div className="mt-3 space-y-2">
                  {msg.chunks.map(chunk => (
                    <div key={chunk.id} className="flex items-start gap-2 text-xs p-2 rounded bg-muted">
                      <BookOpen className="w-3 h-3 mt-0.5 shrink-0 text-accent" />
                      <div>
                        <span className="font-medium">{chunk.section}</span>
                        <span className="text-muted-foreground"> — {chunk.page_hint}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {msg.showEscalate && (
                <div className="mt-3 flex gap-2 flex-wrap">
                  <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => handleCreateTicket(msg.query || '')}>
                    <Ticket className="w-3 h-3 mr-1" /> Create HR Ticket
                  </Button>
                  {(msg.query?.toLowerCase().includes('harassment') || msg.query?.toLowerCase().includes('grievance')) && (
                    <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => handleCreateTicket(msg.query || '', true)}>
                      <ShieldAlert className="w-3 h-3 mr-1" /> Private HR Ticket
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="sticky bottom-0 bg-background pt-2 pb-4">
        <form onSubmit={e => { e.preventDefault(); handleSend(); }} className="flex gap-2">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about company policies, benefits, PTO..."
            className="flex-1"
          />
          <Button type="submit" size="icon"><Send className="w-4 h-4" /></Button>
        </form>
      </div>
    </div>
  );
};

export default AskHR;
