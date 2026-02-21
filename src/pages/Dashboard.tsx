import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { employees } from '@/data/mockData';
import { FilePlus, Calendar, MessageCircleQuestion, Receipt, CheckSquare, DollarSign, Ticket } from 'lucide-react';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { claims, leaveRequests, tickets } = useData();

  const myClaims = claims.filter(c => c.claimant_id === currentUser.id);
  const directReportIds = employees.filter(e => e.manager_id === currentUser.id).map(e => e.id);
  const pendingApprovals = claims.filter(c => directReportIds.includes(c.claimant_id) && c.status === 'submitted');
  const pendingWFH = leaveRequests.filter(l => directReportIds.includes(l.requester_id) && l.status === 'submitted');
  const toValidate = claims.filter(c => c.status === 'manager_approved');
  const toPay = claims.filter(c => c.status === 'finance_validated');
  const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'in_progress');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome back, {currentUser.full_name.split(' ')[0]}</h1>
        <p className="text-sm mt-1 text-muted-foreground">{currentUser.role_title} · {currentUser.department}</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { to: '/claims/submit', icon: FilePlus, label: 'Submit Claim', sub: 'New expense claim' },
          { to: '/leave-wfh', icon: Calendar, label: 'Request WFH', sub: 'Work from home' },
          { to: '/ask-hr', icon: MessageCircleQuestion, label: 'Ask HR', sub: 'Handbook Q&A' },
        ].map(item => (
          <Link key={item.to} to={item.to}>
            <div className="kpi-card flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'hsl(var(--primary) / 0.15)' }}>
                <item.icon className="w-5 h-5" style={{ color: 'hsl(var(--primary))' }} />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.sub}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Role-specific KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="kpi-card">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'hsl(var(--primary) / 0.15)' }}>
              <Receipt className="w-4 h-4" style={{ color: 'hsl(var(--primary))' }} />
            </div>
            <span className="text-sm font-medium text-muted-foreground">My Claims</span>
          </div>
          <p className="text-2xl font-bold mono text-foreground">{myClaims.length}</p>
          <p className="text-xs text-muted-foreground mt-1">{myClaims.filter(c => ['submitted', 'needs_info'].includes(c.status)).length} pending</p>
        </div>

        {currentUser.is_manager && (
          <div className="kpi-card">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'hsl(var(--warning-muted))' }}>
                <CheckSquare className="w-4 h-4" style={{ color: 'hsl(var(--warning))' }} />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Pending Approvals</span>
            </div>
            <p className="text-2xl font-bold mono text-foreground">{pendingApprovals.length + pendingWFH.length}</p>
            <p className="text-xs text-muted-foreground mt-1">{pendingApprovals.length} claims · {pendingWFH.length} WFH</p>
            <Link to="/approvals">
              <button className="btn-glass mt-3 text-xs">View inbox</button>
            </Link>
          </div>
        )}

        {currentUser.is_finance && (
          <div className="kpi-card">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'hsl(var(--positive-muted))' }}>
                <DollarSign className="w-4 h-4" style={{ color: 'hsl(var(--positive))' }} />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Finance Queue</span>
            </div>
            <p className="text-2xl font-bold mono text-foreground">{toValidate.length + toPay.length}</p>
            <p className="text-xs text-muted-foreground mt-1">{toValidate.length} to validate · {toPay.length} to pay</p>
            <Link to="/finance">
              <button className="btn-glass mt-3 text-xs">Open console</button>
            </Link>
          </div>
        )}

        {currentUser.is_hr_admin && (
          <div className="kpi-card">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'hsl(var(--negative-muted))' }}>
                <Ticket className="w-4 h-4" style={{ color: 'hsl(var(--negative))' }} />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Open Tickets</span>
            </div>
            <p className="text-2xl font-bold mono text-foreground">{openTickets.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Requiring attention</p>
            <Link to="/tickets">
              <button className="btn-glass mt-3 text-xs">View tickets</button>
            </Link>
          </div>
        )}
      </div>

      {/* Recent claims */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Recent Claims</h3>
        {myClaims.length === 0 ? (
          <p className="text-sm text-muted-foreground">No claims yet. Submit your first expense claim.</p>
        ) : (
          <div className="space-y-2">
            {myClaims.slice(0, 5).map(claim => (
              <div key={claim.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'hsl(var(--surface-3))' }}>
                <div>
                  <p className="text-sm font-medium text-foreground">{claim.id} · {claim.category.replace(/_/g, ' ')}</p>
                  <p className="text-xs text-muted-foreground">{claim.business_purpose}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold mono text-foreground">{claim.currency} {claim.amount.toFixed(2)}</p>
                  <StatusBadge status={claim.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
