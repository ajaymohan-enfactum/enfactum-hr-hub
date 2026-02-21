import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome back, {currentUser.full_name.split(' ')[0]}</h1>
        <p className="text-muted-foreground text-sm">{currentUser.role_title} · {currentUser.department}</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/claims/submit">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="p-2 rounded-lg bg-accent-muted">
                <FilePlus className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">Submit Claim</p>
                <p className="text-xs text-muted-foreground">New expense claim</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/leave-wfh">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="p-2 rounded-lg bg-accent-muted">
                <Calendar className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">Request WFH</p>
                <p className="text-xs text-muted-foreground">Work from home</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/ask-hr">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="p-2 rounded-lg bg-accent-muted">
                <MessageCircleQuestion className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">Ask HR</p>
                <p className="text-xs text-muted-foreground">Handbook Q&A</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Role-specific stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Receipt className="w-4 h-4" /> My Claims
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{myClaims.length}</p>
            <p className="text-xs text-muted-foreground">{myClaims.filter(c => ['submitted', 'needs_info'].includes(c.status)).length} pending</p>
          </CardContent>
        </Card>

        {currentUser.is_manager && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckSquare className="w-4 h-4" /> Pending Approvals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{pendingApprovals.length + pendingWFH.length}</p>
              <p className="text-xs text-muted-foreground">{pendingApprovals.length} claims · {pendingWFH.length} WFH</p>
              <Link to="/approvals">
                <Button variant="outline" size="sm" className="mt-2 text-xs">View inbox</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {currentUser.is_finance && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> Finance Queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{toValidate.length + toPay.length}</p>
              <p className="text-xs text-muted-foreground">{toValidate.length} to validate · {toPay.length} to pay</p>
              <Link to="/finance">
                <Button variant="outline" size="sm" className="mt-2 text-xs">Open console</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {currentUser.is_hr_admin && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Ticket className="w-4 h-4" /> Open Tickets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{openTickets.length}</p>
              <p className="text-xs text-muted-foreground">Requiring attention</p>
              <Link to="/tickets">
                <Button variant="outline" size="sm" className="mt-2 text-xs">View tickets</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent claims */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Recent Claims</CardTitle>
        </CardHeader>
        <CardContent>
          {myClaims.length === 0 ? (
            <p className="text-sm text-muted-foreground">No claims yet. Submit your first expense claim.</p>
          ) : (
            <div className="space-y-3">
              {myClaims.slice(0, 5).map(claim => (
                <div key={claim.id} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                  <div>
                    <p className="text-sm font-medium text-foreground">{claim.id} · {claim.category.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-muted-foreground">{claim.business_purpose}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">{claim.currency} {claim.amount.toFixed(2)}</p>
                    <StatusBadge status={claim.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
