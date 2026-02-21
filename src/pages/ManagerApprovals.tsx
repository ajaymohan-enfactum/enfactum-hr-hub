import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { employees } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Approvals Inbox</h1>
        <p className="text-muted-foreground text-sm">{pendingClaims.length + pendingWFH.length} items pending</p>
      </div>

      <Tabs defaultValue="claims">
        <TabsList>
          <TabsTrigger value="claims">Claims ({pendingClaims.length})</TabsTrigger>
          <TabsTrigger value="wfh">Leave/WFH ({pendingWFH.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="claims" className="space-y-3 mt-4">
          {pendingClaims.length === 0 ? (
            <Card><CardContent className="p-6 text-center text-muted-foreground">No pending claims.</CardContent></Card>
          ) : pendingClaims.map(claim => (
            <Card key={claim.id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-foreground">{getEmployeeName(claim.claimant_id)}</p>
                    <p className="text-sm text-muted-foreground">{claim.category.replace(/_/g, ' ')} · {new Date(claim.expense_date).toLocaleDateString()}</p>
                    <p className="text-sm text-foreground mt-1">{claim.business_purpose}</p>
                    {claim.attendees && <p className="text-xs text-muted-foreground">Attendees: {claim.attendees}</p>}
                    <p className="text-xs text-muted-foreground mt-1">{claim.receipt_files.length > 0 ? '📎 Receipt attached' : '⚠️ No receipt'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-foreground">{claim.currency} {claim.amount.toFixed(2)}</p>
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
                  <Button size="sm" onClick={() => handleClaimAction(claim.id, 'approve')} className="flex-1">
                    <CheckCircle className="w-4 h-4 mr-1" /> Approve
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleClaimAction(claim.id, 'needs_info')}>
                    <HelpCircle className="w-4 h-4 mr-1" /> Need Info
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleClaimAction(claim.id, 'reject')}>
                    <XCircle className="w-4 h-4 mr-1" /> Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="wfh" className="space-y-3 mt-4">
          {pendingWFH.length === 0 ? (
            <Card><CardContent className="p-6 text-center text-muted-foreground">No pending leave/WFH requests.</CardContent></Card>
          ) : pendingWFH.map(req => (
            <Card key={req.id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-foreground">{getEmployeeName(req.requester_id)}</p>
                    <p className="text-sm text-muted-foreground">{req.request_type} · {new Date(req.start_date).toLocaleDateString()} – {new Date(req.end_date).toLocaleDateString()}</p>
                    <p className="text-sm text-foreground mt-1">{req.reason}</p>
                  </div>
                  <StatusBadge status={req.status} />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleLeaveAction(req.id, 'approve')} className="flex-1">
                    <CheckCircle className="w-4 h-4 mr-1" /> Approve
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleLeaveAction(req.id, 'needs_info')}>
                    <HelpCircle className="w-4 h-4 mr-1" /> Need Info
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleLeaveAction(req.id, 'reject')}>
                    <XCircle className="w-4 h-4 mr-1" /> Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManagerApprovals;
