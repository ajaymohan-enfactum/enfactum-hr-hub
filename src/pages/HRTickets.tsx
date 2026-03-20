import { useState } from 'react';
import { StaggerContainer, StaggerItem } from '@/components/motion/MotionPrimitives';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/StatusBadge';
import { useToast } from '@/hooks/use-toast';
import { employees } from '@/data/mockData';
import { TicketType } from '@/types/hr';
import { Plus, Ticket, ShieldAlert } from 'lucide-react';

const ticketTypes: { value: TicketType; label: string }[] = [
  { value: 'policy_question', label: 'Policy Question' },
  { value: 'payroll', label: 'Payroll' },
  { value: 'benefits', label: 'Benefits' },
  { value: 'IT_security', label: 'IT & Security' },
  { value: 'grievance', label: 'Grievance' },
  { value: 'harassment', label: 'Harassment (Private)' },
  { value: 'other', label: 'Other' },
];

const HRTickets = () => {
  const { currentUser } = useAuth();
  const { tickets, setTickets } = useData();
  const { toast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [ticketType, setTicketType] = useState<string>('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const visibleTickets = currentUser.is_hr_admin
    ? tickets
    : tickets.filter(t => t.requester_id === currentUser.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketType || !subject || !description) {
      toast({ title: 'Missing fields', variant: 'destructive' });
      return;
    }
    const isPrivate = ['harassment', 'grievance'].includes(ticketType);
    const newTicket = {
      id: `TKT-${String(tickets.length + 1).padStart(3, '0')}`,
      requester_id: currentUser.id,
      ticket_type: ticketType as TicketType,
      subject,
      description,
      status: 'open' as const,
      assigned_to: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      private_flag: isPrivate,
    };
    setTickets(prev => [newTicket, ...prev]);
    toast({ title: 'Ticket created', description: `${newTicket.id} has been submitted.` });
    setShowForm(false);
    setTicketType(''); setSubject(''); setDescription('');
  };

  const handleAssign = (ticketId: string) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, assigned_to: currentUser.id, status: 'in_progress' as const, updated_at: new Date().toISOString() } : t));
    toast({ title: 'Ticket assigned to you' });
  };

  const handleResolve = (ticketId: string) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'resolved' as const, updated_at: new Date().toISOString() } : t));
    toast({ title: 'Ticket resolved' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">HR Tickets</h1>
          <p className="text-muted-foreground text-sm">{currentUser.is_hr_admin ? 'All tickets' : 'Your tickets'}</p>
        </div>
        <button className="btn-primary text-sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : <><Plus className="w-4 h-4" /> New Ticket</>}
        </button>
      </div>

      {/* KPI row for HR admin */}
      {currentUser.is_hr_admin && (
        <div className="grid grid-cols-3 gap-4">
          <div className="kpi-card">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'hsl(var(--info-muted))' }}>
                <Ticket className="w-3.5 h-3.5" style={{ color: 'hsl(var(--info))' }} />
              </div>
              <span className="text-xs text-muted-foreground">Open</span>
            </div>
            <p className="text-xl font-bold mono text-foreground">{tickets.filter(t => t.status === 'open').length}</p>
          </div>
          <div className="kpi-card">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'hsl(var(--warning-muted))' }}>
                <Ticket className="w-3.5 h-3.5" style={{ color: 'hsl(var(--warning))' }} />
              </div>
              <span className="text-xs text-muted-foreground">In Progress</span>
            </div>
            <p className="text-xl font-bold mono text-foreground">{tickets.filter(t => t.status === 'in_progress').length}</p>
          </div>
          <div className="kpi-card">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'hsl(var(--positive-muted))' }}>
                <Ticket className="w-3.5 h-3.5" style={{ color: 'hsl(var(--positive))' }} />
              </div>
              <span className="text-xs text-muted-foreground">Resolved</span>
            </div>
            <p className="text-xl font-bold mono text-foreground">{tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length}</p>
          </div>
        </div>
      )}

      {showForm && (
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Create Ticket</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Type *</Label>
              <Select value={ticketType} onValueChange={setTicketType}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {ticketTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {['harassment', 'grievance'].includes(ticketType) && (
              <div className="rounded-lg p-2 flex items-center gap-2 text-xs" style={{ background: 'hsl(var(--negative-muted))' }}>
                <ShieldAlert className="w-3.5 h-3.5" style={{ color: 'hsl(var(--negative))' }} />
                <span style={{ color: 'hsl(var(--negative))' }}>This ticket will be marked as private and only visible to HR.</span>
              </div>
            )}
            <div className="space-y-2">
              <Label>Subject *</Label>
              <Input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Brief subject" />
            </div>
            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe your question or issue" rows={4} />
            </div>
            <button type="submit" className="btn-primary text-sm">Submit Ticket</button>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {visibleTickets.length === 0 ? (
          <div className="glass-card p-6 text-center text-muted-foreground">No tickets.</div>
        ) : visibleTickets.map(ticket => (
          <div key={ticket.id} className="glass-card p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="mono text-xs text-muted-foreground">{ticket.id}</span>
                  <StatusBadge status={ticket.status} />
                  {ticket.private_flag && (
                    <span className="text-[10px] rounded-full px-2 py-0.5 font-medium" style={{ background: 'hsl(var(--negative-muted))', color: 'hsl(var(--negative))' }}>
                      Private
                    </span>
                  )}
                  <span className="text-[10px] rounded-full px-2 py-0.5 font-medium capitalize" style={{ background: 'hsl(var(--surface-3))', color: 'hsl(var(--muted-foreground))' }}>
                    {ticket.ticket_type.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="font-medium text-foreground mt-1">{ticket.subject}</p>
                <p className="text-sm text-muted-foreground">{ticket.description}</p>
                {currentUser.is_hr_admin && (
                  <p className="text-xs text-muted-foreground mt-1">
                    From: {employees.find(e => e.id === ticket.requester_id)?.full_name || 'Unknown'}
                    {ticket.assigned_to && ` · Assigned: ${employees.find(e => e.id === ticket.assigned_to)?.full_name}`}
                  </p>
                )}
                <p className="text-[10px] text-muted-foreground mono mt-1">
                  {new Date(ticket.created_at).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              {currentUser.is_hr_admin && ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                <div className="flex gap-2 shrink-0">
                  {!ticket.assigned_to && (
                    <button className="btn-glass text-xs" onClick={() => handleAssign(ticket.id)}>Assign to me</button>
                  )}
                  {ticket.assigned_to && (
                    <button className="btn-primary text-xs" onClick={() => handleResolve(ticket.id)}>Resolve</button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HRTickets;
