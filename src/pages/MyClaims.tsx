import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';
import { employees } from '@/data/mockData';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FilePlus } from 'lucide-react';

const MyClaims = () => {
  const { currentUser } = useAuth();
  const { claims, approvals } = useData();

  const myClaims = claims.filter(c => c.claimant_id === currentUser.id);

  const getApprovalComment = (claimId: string) => {
    const approval = approvals.find(a => a.claim_id === claimId);
    if (!approval) return null;
    const approver = employees.find(e => e.id === approval.approver_id);
    return { ...approval, approver_name: approver?.full_name || 'Unknown' };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Claims</h1>
          <p className="text-muted-foreground text-sm">{myClaims.length} total claims</p>
        </div>
        <Link to="/claims/submit">
          <Button size="sm"><FilePlus className="w-4 h-4 mr-1" /> New Claim</Button>
        </Link>
      </div>

      {myClaims.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No claims yet. Submit your first expense claim.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {myClaims.map(claim => {
            const approval = getApprovalComment(claim.id);
            return (
              <Card key={claim.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs text-muted-foreground">{claim.id}</span>
                        <StatusBadge status={claim.status} />
                      </div>
                      <p className="font-medium text-foreground mt-1">{claim.category.replace(/_/g, ' ')}</p>
                      <p className="text-sm text-muted-foreground truncate">{claim.business_purpose}</p>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(claim.expense_date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-bold text-foreground">{claim.currency} {claim.amount.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">{claim.receipt_files.length > 0 ? '📎 Receipt' : '⚠️ No receipt'}</p>
                    </div>
                  </div>
                  {approval && (
                    <div className="mt-3 p-2 rounded bg-muted text-xs">
                      <span className="font-medium">{approval.approver_name}:</span> {approval.comment}
                    </div>
                  )}
                  {/* Status timeline */}
                  <div className="mt-3 flex items-center gap-1 text-xs">
                    {['submitted', 'manager_approved', 'finance_validated', 'paid'].map((step, i) => {
                      const statusOrder = ['draft', 'submitted', 'needs_info', 'rejected', 'manager_approved', 'finance_validated', 'paid'];
                      const currentIdx = statusOrder.indexOf(claim.status);
                      const stepIdx = statusOrder.indexOf(step);
                      const isActive = stepIdx <= currentIdx && !['needs_info', 'rejected'].includes(claim.status);
                      return (
                        <div key={step} className="flex items-center gap-1">
                          {i > 0 && <div className={`w-6 h-0.5 ${isActive ? 'bg-accent' : 'bg-border'}`} />}
                          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-accent' : claim.status === 'rejected' && step === 'submitted' ? 'bg-destructive' : 'bg-border'}`} />
                        </div>
                      );
                    })}
                    <span className="ml-2 text-muted-foreground">
                      {claim.status === 'paid' ? 'Complete' : claim.status === 'rejected' ? 'Rejected' : 'In progress'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyClaims;
