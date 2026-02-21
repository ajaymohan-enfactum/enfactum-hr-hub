import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/StatusBadge';
import { useToast } from '@/hooks/use-toast';
import { employees } from '@/data/mockData';
import { TicketType } from '@/types/hr';

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">HR Tickets</h1>
          <p className="text-muted-foreground text-sm">{currentUser.is_hr_admin ? 'All tickets' : 'Your tickets'}</p>
        </div>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'New Ticket'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle className="text-base">Create Ticket</CardTitle></CardHeader>
          <CardContent>
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
                <p className="text-xs text-muted-foreground bg-muted p-2 rounded">🔒 This ticket will be marked as private and only visible to HR.</p>
              )}
              <div className="space-y-2">
                <Label>Subject *</Label>
                <Input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Brief subject" />
              </div>
              <div className="space-y-2">
                <Label>Description *</Label>
                <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe your question or issue" rows={4} />
              </div>
              <Button type="submit">Submit Ticket</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {visibleTickets.length === 0 ? (
          <Card><CardContent className="p-6 text-center text-muted-foreground">No tickets.</CardContent></Card>
        ) : visibleTickets.map(ticket => (
          <Card key={ticket.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs text-muted-foreground">{ticket.id}</span>
                    <StatusBadge status={ticket.status} />
                    {ticket.private_flag && <span className="text-xs bg-destructive-muted text-destructive px-1.5 py-0.5 rounded">Private</span>}
                    <span className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{ticket.ticket_type.replace(/_/g, ' ')}</span>
                  </div>
                  <p className="font-medium text-foreground mt-1">{ticket.subject}</p>
                  <p className="text-sm text-muted-foreground">{ticket.description}</p>
                  {currentUser.is_hr_admin && (
                    <p className="text-xs text-muted-foreground mt-1">
                      From: {employees.find(e => e.id === ticket.requester_id)?.full_name || 'Unknown'}
                      {ticket.assigned_to && ` · Assigned: ${employees.find(e => e.id === ticket.assigned_to)?.full_name}`}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">{new Date(ticket.created_at).toLocaleDateString()}</p>
                </div>
                {currentUser.is_hr_admin && ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                  <div className="flex gap-2 shrink-0">
                    {!ticket.assigned_to && <Button size="sm" variant="outline" onClick={() => handleAssign(ticket.id)}>Assign to me</Button>}
                    {ticket.assigned_to && <Button size="sm" onClick={() => handleResolve(ticket.id)}>Resolve</Button>}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HRTickets;
