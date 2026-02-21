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
import { LeaveRequestType } from '@/types/hr';
import { AlertCircle, ExternalLink } from 'lucide-react';

const LeaveWFH = () => {
  const { currentUser } = useAuth();
  const { leaveRequests, setLeaveRequests } = useData();
  const { toast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState<string>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const myRequests = leaveRequests.filter(l => l.requester_id === currentUser.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !startDate || !endDate || !reason) {
      toast({ title: 'Missing fields', variant: 'destructive' });
      return;
    }
    const newReq = {
      id: `LV-${String(leaveRequests.length + 1).padStart(3, '0')}`,
      requester_id: currentUser.id,
      request_type: type as LeaveRequestType,
      start_date: startDate,
      end_date: endDate,
      reason,
      status: 'submitted' as const,
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setLeaveRequests(prev => [newReq, ...prev]);
    toast({ title: 'Request submitted' });
    setShowForm(false);
    setType(''); setStartDate(''); setEndDate(''); setReason('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Leave & WFH</h1>
          <p className="text-muted-foreground text-sm">Track your leave and WFH requests</p>
        </div>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'New Request'}
        </Button>
      </div>

      <div className="flex gap-2 p-3 rounded-lg bg-accent-muted border border-accent-muted">
        <AlertCircle className="w-4 h-4 text-accent mt-0.5 shrink-0" />
        <p className="text-xs text-foreground">
          PTO must be officially submitted in <strong>HRMS (Payboy)</strong>.{' '}
          <a href="#" className="text-accent inline-flex items-center gap-1 hover:underline">
            Open Payboy <ExternalLink className="w-3 h-3" />
          </a>
        </p>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle className="text-base">New Request</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Type *</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WFH">Work From Home</SelectItem>
                      <SelectItem value="sick">Sick Leave</SelectItem>
                      <SelectItem value="PTO">PTO (Tracker Only)</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>End Date *</Label>
                  <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Reason *</Label>
                <Textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Reason for request" rows={2} />
              </div>
              {type === 'PTO' && (
                <p className="text-xs text-muted-foreground bg-muted p-2 rounded">
                  ⓘ This creates a tracker entry only. Please submit the official PTO request in Payboy.
                </p>
              )}
              <Button type="submit">Submit Request</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {myRequests.length === 0 ? (
          <Card><CardContent className="p-6 text-center text-muted-foreground">No requests yet.</CardContent></Card>
        ) : myRequests.map(req => (
          <Card key={req.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{req.id}</span>
                    <StatusBadge status={req.status} />
                    {req.request_type === 'PTO' && <span className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">Tracker only</span>}
                  </div>
                  <p className="font-medium text-foreground mt-1">{req.request_type}</p>
                  <p className="text-sm text-muted-foreground">{new Date(req.start_date).toLocaleDateString()} – {new Date(req.end_date).toLocaleDateString()}</p>
                  <p className="text-sm text-foreground mt-1">{req.reason}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LeaveWFH;
