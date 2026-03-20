import { useAuth } from '@/contexts/AuthContext';
import { StaggerContainer, StaggerItem } from '@/components/motion/MotionPrimitives';
import { useData } from '@/contexts/DataContext';
import { StatusBadge } from '@/components/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { employees } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { CheckCircle, XCircle, HelpCircle, Inbox } from 'lucide-react';

const ManagerApprovals = () => {
  const { currentUser } = useAuth();
  const { claims, setClaims, leaveRequests, setLeaveRequests, setApprovals } = useData();
  const { toast } = useToast();
  const [comment, setComment] = useState<Record<string, string>>({});

  const directReportIds = employees.filter(e => e.manager_id === currentUser.id).map(e => e.id);
  const pendingClaims = claims.filter(c => directReportIds.includes(c.claimant_id) && c.status === 'submitted');
  const pendingWFH = leaveRequests.filter(l => directReportIds.includes(l.requester_id) && l.status === 'submitted');

  const handleClaimAction = (claimId: string, decision: 'approve' | 'reject' | 'needs_info') => {
    const statusMap = { approve: 'manager_approved', reject: 'rejected', needs_info: 'needs_info' } as const;
    setClaims(prev => prev.map(c => c.id === claimId ? { ...c, status: statusMap[decision], updated_at: new Date().toISOString() } : c));
    setApprovals(prev => [...prev, {
      id: `apr-${Date.now()}`, claim_id: claimId, approver_id: currentUser.id,
      decision, comment: comment[claimId] || '', decided_at: new Date().toISOString()
    }]);
    toast({ title: `Claim ${decision === 'approve' ? 'approved' : decision === 'reject' ? 'rejected' : 'returned for info'}` });
  };

  const handleLeaveAction = (reqId: string, decision: 'approve' | 'reject' | 'needs_info') => {
    const statusMap = { approve: 'manager_approved', reject: 'rejected', needs_info: 'needs_info' } as const;
    setLeaveRequests(prev => prev.map(l => l.id === reqId ? { ...l, status: statusMap[decision], updated_at: new Date().toISOString() } : l));
    toast({ title: `Request ${decision === 'approve' ? 'approved' : decision === 'reject' ? 'rejected' : 'returned for info'}` });
  };

  const getEmployeeName = (id: string) => employees.find(e => e.id === id)?.full_name || 'Unknown';

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Approvals Inbox</h1>
        <p className="text-muted-foreground text-sm">{pendingClaims.length + pendingWFH.length} items pending</p>
      </div>

      {/* KPI summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="kpi-card">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'hsl(var(--primary) / 0.15)' }}>
              <Inbox className="w-3.5 h-3.5" style={{ color: 'hsl(var(--primary))' }} />
            </div>
            <span className="text-xs text-muted-foreground">Pending Claims</span>
          </div>
          <p className="text-xl font-bold mono text-foreground">{pendingClaims.length}</p>
        </div>
        <div className="kpi-card">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'hsl(var(--warning-muted))' }}>
              <HelpCircle className="w-3.5 h-3.5" style={{ color: 'hsl(var(--warning))' }} />
            </div>
            <span className="text-xs text-muted-foreground">Pending Leave/WFH</span>
          </div>
          <p className="text-xl font-bold mono text-foreground">{pendingWFH.length}</p>
        </div>
      </div>

      <Tabs defaultValue="claims">
        <TabsList>
          <TabsTrigger value="claims">Claims ({pendingClaims.length})</TabsTrigger>
          <TabsTrigger value="wfh">Leave/WFH ({pendingWFH.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="claims" className="space-y-3 mt-4">
          {pendingClaims.length === 0 ? (
            <div className="glass-card p-6 text-center text-muted-foreground">No pending claims.</div>
          ) : pendingClaims.map(claim => (
            <div key={claim.id} className="glass-card p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-foreground">{getEmployeeName(claim.claimant_id)}</p>
                  <p className="text-sm text-muted-foreground capitalize">{claim.category.replace(/_/g, ' ')} · {new Date(claim.expense_date).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  <p className="text-sm text-foreground mt-1">{claim.business_purpose}</p>
                  {claim.attendees && <p className="text-xs text-muted-foreground">Attendees: {claim.attendees}</p>}
                  <p className="text-xs text-muted-foreground mt-1">{claim.receipt_files.length > 0 ? '📎 Receipt attached' : '⚠️ No receipt'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold mono text-foreground">{claim.currency} {claim.amount.toFixed(2)}</p>
                  <StatusBadge status={claim.status} />
                </div>
              </div>
              <Textarea
                placeholder="Add comment (required for reject/need info)..."
                value={comment[claim.id] || ''}
                onChange={e => setComment(prev => ({ ...prev, [claim.id]: e.target.value }))}
                rows={2} className="text-sm"
              />
              <div className="flex gap-2">
                <button className="btn-primary flex-1 justify-center text-xs" onClick={() => handleClaimAction(claim.id, 'approve')}>
                  <CheckCircle className="w-4 h-4" /> Approve
                </button>
                <button className="btn-glass text-xs" onClick={() => handleClaimAction(claim.id, 'needs_info')}>
                  <HelpCircle className="w-4 h-4" /> Need Info
                </button>
                <button className="btn-ghost text-xs" style={{ borderColor: 'hsl(var(--negative) / 0.3)', color: 'hsl(var(--negative))' }} onClick={() => handleClaimAction(claim.id, 'reject')}>
                  <XCircle className="w-4 h-4" /> Reject
                </button>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="wfh" className="space-y-3 mt-4">
          {pendingWFH.length === 0 ? (
            <div className="glass-card p-6 text-center text-muted-foreground">No pending leave/WFH requests.</div>
          ) : pendingWFH.map(req => (
            <div key={req.id} className="glass-card p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-foreground">{getEmployeeName(req.requester_id)}</p>
                  <p className="text-sm text-muted-foreground">{req.request_type} · {new Date(req.start_date).toLocaleDateString('en-SG', { day: 'numeric', month: 'short' })} – {new Date(req.end_date).toLocaleDateString('en-SG', { day: 'numeric', month: 'short' })}</p>
                  <p className="text-sm text-foreground mt-1">{req.reason}</p>
                </div>
                <StatusBadge status={req.status} />
              </div>
              <div className="flex gap-2">
                <button className="btn-primary flex-1 justify-center text-xs" onClick={() => handleLeaveAction(req.id, 'approve')}>
                  <CheckCircle className="w-4 h-4" /> Approve
                </button>
                <button className="btn-glass text-xs" onClick={() => handleLeaveAction(req.id, 'needs_info')}>
                  <HelpCircle className="w-4 h-4" /> Need Info
                </button>
                <button className="btn-ghost text-xs" style={{ borderColor: 'hsl(var(--negative) / 0.3)', color: 'hsl(var(--negative))' }} onClick={() => handleLeaveAction(req.id, 'reject')}>
                  <XCircle className="w-4 h-4" /> Reject
                </button>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManagerApprovals;
