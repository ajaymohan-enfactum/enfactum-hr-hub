import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { StatusBadge } from '@/components/StatusBadge';
import { employees } from '@/data/mockData';
import { Link } from 'react-router-dom';
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
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Claims</h1>
          <p className="text-muted-foreground text-sm">{myClaims.length} total claims</p>
        </div>
        <Link to="/claims/submit">
          <button className="btn-primary text-sm"><FilePlus className="w-4 h-4" /> New Claim</button>
        </Link>
      </div>

      {myClaims.length === 0 ? (
        <div className="glass-card p-8 text-center text-muted-foreground">No claims yet. Submit your first expense claim.</div>
      ) : (
        <div className="space-y-3">
          {myClaims.map(claim => {
            const approval = getApprovalComment(claim.id);
            return (
              <Link to={`/claims/${claim.id}`} key={claim.id}>
                <div className="glass-card p-4 cursor-pointer hover:border-[hsl(var(--primary)/0.28)] transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="mono text-xs text-muted-foreground">{claim.id}</span>
                        <StatusBadge status={claim.status} />
                      </div>
                      <p className="font-medium text-foreground mt-1 capitalize">{claim.category.replace(/_/g, ' ')}</p>
                      <p className="text-sm text-muted-foreground truncate">{claim.business_purpose}</p>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(claim.expense_date).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-bold mono text-foreground">{claim.currency} {claim.amount.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">{claim.receipt_files.length > 0 ? '📎 Receipt' : '⚠️ No receipt'}</p>
                    </div>
                  </div>
                  {approval && (
                    <div className="mt-3 p-2 rounded-lg text-xs" style={{ background: 'hsl(var(--surface-3))' }}>
                      <span className="font-medium text-foreground">{approval.approver_name}:</span>{' '}
                      <span className="text-muted-foreground">{approval.comment}</span>
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
                          {i > 0 && <div className="w-6 h-0.5 rounded-full" style={{ background: isActive ? 'hsl(var(--primary))' : 'hsl(var(--border))' }} />}
                          <div className="w-2 h-2 rounded-full" style={{ background: isActive ? 'hsl(var(--primary))' : claim.status === 'rejected' && step === 'submitted' ? 'hsl(var(--negative))' : 'hsl(var(--border))' }} />
                        </div>
                      );
                    })}
                    <span className="ml-2 text-muted-foreground">
                      {claim.status === 'paid' ? 'Complete' : claim.status === 'rejected' ? 'Rejected' : 'In progress'}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyClaims;
