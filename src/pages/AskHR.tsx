import { useState, useRef, useEffect } from 'react';
import { StaggerContainer, StaggerItem } from '@/components/motion/MotionPrimitives';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
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
    <StaggerContainer className="max-w-3xl mx-auto space-y-6">
      <StaggerItem>
        <h1 className="text-2xl font-bold text-foreground">Ask HR</h1>
        <p className="text-muted-foreground text-sm">Search the employee handbook or ask a question</p>
      </StaggerItem>

      {messages.length === 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">Suggested questions</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {suggestedQuestions.map(q => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="text-left p-3 rounded-xl text-sm text-foreground transition-all"
                style={{
                  background: 'hsl(var(--surface-3))',
                  border: '1px solid hsl(var(--border))',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'hsl(var(--primary) / 0.4)';
                  e.currentTarget.style.background = 'hsl(var(--primary) / 0.08)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'hsl(var(--border))';
                  e.currentTarget.style.background = 'hsl(var(--surface-3))';
                }}
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
            <div
              className="max-w-[85%] rounded-2xl px-4 py-3"
              style={msg.role === 'user'
                ? { background: 'var(--gradient-primary)', color: 'hsl(var(--primary-foreground))' }
                : { background: 'hsl(var(--surface-2))', border: '1px solid hsl(var(--border))' }
              }
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              {msg.chunks && msg.chunks.length > 0 && (
                <div className="mt-3 space-y-2">
                  {msg.chunks.map(chunk => (
                    <div key={chunk.id} className="flex items-start gap-2 text-xs p-2 rounded-lg" style={{ background: 'hsl(var(--surface-3))' }}>
                      <BookOpen className="w-3 h-3 mt-0.5 shrink-0" style={{ color: 'hsl(var(--primary))' }} />
                      <div>
                        <span className="font-medium text-foreground">{chunk.section}</span>
                        <span className="text-muted-foreground"> — {chunk.page_hint}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {msg.showEscalate && (
                <div className="mt-3 flex gap-2 flex-wrap">
                  <button className="btn-glass text-xs" onClick={() => handleCreateTicket(msg.query || '')}>
                    <Ticket className="w-3 h-3" /> Create HR Ticket
                  </button>
                  {(msg.query?.toLowerCase().includes('harassment') || msg.query?.toLowerCase().includes('grievance')) && (
                    <button
                      className="btn-ghost text-xs"
                      style={{ borderColor: 'hsl(var(--negative) / 0.3)', color: 'hsl(var(--negative))' }}
                      onClick={() => handleCreateTicket(msg.query || '', true)}
                    >
                      <ShieldAlert className="w-3 h-3" /> Private HR Ticket
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="sticky bottom-0 pt-2 pb-4" style={{ background: 'hsl(var(--background))' }}>
        <form onSubmit={e => { e.preventDefault(); handleSend(); }} className="flex gap-2">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about company policies, benefits, PTO..."
            className="flex-1"
          />
          <Button type="submit" size="icon" style={{ background: 'var(--gradient-primary)' }}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </StaggerContainer>
  );
};

export default AskHR;
