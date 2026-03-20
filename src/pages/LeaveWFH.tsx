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
import { LeaveRequestType } from '@/types/hr';
import { AlertCircle, ExternalLink, Plus, Calendar } from 'lucide-react';

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
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Leave & WFH</h1>
          <p className="text-muted-foreground text-sm">Track your leave and WFH requests</p>
        </div>
        <button className="btn-primary text-sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : <><Plus className="w-4 h-4" /> New Request</>}
        </button>
      </div>

      <div className="rounded-xl p-3 flex gap-2" style={{ background: 'hsl(var(--info-muted))' }}>
        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'hsl(var(--info))' }} />
        <p className="text-xs text-foreground">
          PTO must be officially submitted in <strong>HRMS (Payboy)</strong>.{' '}
          <a href="#" className="inline-flex items-center gap-1 hover:underline" style={{ color: 'hsl(var(--primary))' }}>
            Open Payboy <ExternalLink className="w-3 h-3" />
          </a>
        </p>
      </div>

      {showForm && (
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">New Request</h3>
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
              <div className="rounded-lg p-2 text-xs text-muted-foreground" style={{ background: 'hsl(var(--warning-muted))' }}>
                <span style={{ color: 'hsl(var(--warning))' }}>ⓘ</span> This creates a tracker entry only. Please submit the official PTO request in Payboy.
              </div>
            )}
            <button type="submit" className="btn-primary text-sm">Submit Request</button>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {myRequests.length === 0 ? (
          <div className="glass-card p-6 text-center text-muted-foreground">No requests yet.</div>
        ) : myRequests.map(req => (
          <div key={req.id} className="glass-card p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="mono text-xs text-muted-foreground">{req.id}</span>
                  <StatusBadge status={req.status} />
                  {req.request_type === 'PTO' && (
                    <span className="text-[10px] rounded-full px-2 py-0.5 font-medium" style={{ background: 'hsl(var(--warning-muted))', color: 'hsl(var(--warning))' }}>
                      Tracker only
                    </span>
                  )}
                </div>
                <p className="font-medium text-foreground mt-1">{req.request_type}</p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                  <Calendar className="w-3 h-3" />
                  {new Date(req.start_date).toLocaleDateString('en-SG', { day: 'numeric', month: 'short' })} – {new Date(req.end_date).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
                <p className="text-sm text-foreground mt-1">{req.reason}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaveWFH;
