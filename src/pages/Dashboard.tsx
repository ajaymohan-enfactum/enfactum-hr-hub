import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Link } from 'react-router-dom';
import { StatusBadge } from '@/components/StatusBadge';
import { employees } from '@/data/mockData';
import { FilePlus, Calendar, MessageCircleQuestion, Receipt, CheckSquare, DollarSign, Ticket } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useMemo } from 'react';

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

  // Claims by status donut data
  const statusColors: Record<string, string> = {
    draft: 'hsl(215, 15%, 52%)',
    submitted: 'hsl(210, 100%, 58%)',
    needs_info: 'hsl(38, 95%, 56%)',
    rejected: 'hsl(0, 72%, 56%)',
    manager_approved: 'hsl(155, 60%, 46%)',
    finance_validated: 'hsl(180, 60%, 46%)',
    paid: 'hsl(280, 70%, 62%)',
  };

  const statusLabels: Record<string, string> = {
    draft: 'Draft', submitted: 'Submitted', needs_info: 'Needs Info',
    rejected: 'Rejected', manager_approved: 'Approved', finance_validated: 'Validated', paid: 'Paid',
  };

  const donutData = useMemo(() => {
    const counts: Record<string, number> = {};
    claims.forEach(c => { counts[c.status] = (counts[c.status] || 0) + 1; });
    return Object.entries(counts).map(([status, value]) => ({
      name: statusLabels[status] || status,
      value,
      color: statusColors[status] || 'hsl(215, 15%, 52%)',
    }));
  }, [claims]);

  // Monthly spending bar data
  const monthlyData = useMemo(() => {
    const months: Record<string, number> = {};
    claims.forEach(c => {
      const d = new Date(c.expense_date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      months[key] = (months[key] || 0) + c.amount;
    });
    return Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, amount]) => {
        const [y, m] = month.split('-');
        const label = new Date(+y, +m - 1).toLocaleDateString('en-SG', { month: 'short', year: '2-digit' });
        return { month: label, amount: Math.round(amount) };
      });
  }, [claims]);

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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Claims by Status Donut */}
        <div className="kpi-card">
          <h3 className="text-sm font-semibold text-foreground mb-4">Claims by Status</h3>
          <div className="flex items-center gap-4">
            <div className="w-40 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%" cy="50%"
                    innerRadius={40} outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {donutData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: 'hsl(220, 22%, 10%)', border: '1px solid hsl(220, 18%, 20%)', borderRadius: '12px', fontSize: '12px', color: 'hsl(210, 20%, 93%)' }}
                    itemStyle={{ color: 'hsl(210, 20%, 93%)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-1.5">
              {donutData.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="mono font-medium text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Spending Bar */}
        <div className="kpi-card">
          <h3 className="text-sm font-semibold text-foreground mb-4">Monthly Spending (SGD)</h3>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 18%, 20%)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(215, 15%, 52%)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(215, 15%, 52%)' }} axisLine={false} tickLine={false} width={50} />
                <Tooltip
                  contentStyle={{ background: 'hsl(220, 22%, 10%)', border: '1px solid hsl(220, 18%, 20%)', borderRadius: '12px', fontSize: '12px', color: 'hsl(210, 20%, 93%)' }}
                  itemStyle={{ color: 'hsl(210, 20%, 93%)' }}
                  formatter={(value: number) => [`SGD ${value}`, 'Spending']}
                />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]} fill="url(#barGradient)" />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(210, 100%, 58%)" />
                    <stop offset="100%" stopColor="hsl(235, 90%, 68%)" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent claims */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Recent Claims</h3>
        {myClaims.length === 0 ? (
          <p className="text-sm text-muted-foreground">No claims yet. Submit your first expense claim.</p>
        ) : (
          <div className="space-y-2">
            {myClaims.slice(0, 5).map(claim => (
              <Link to={`/claims/${claim.id}`} key={claim.id}>
                <div className="flex items-center justify-between p-3 rounded-xl cursor-pointer hover:brightness-110 transition-all" style={{ background: 'hsl(var(--surface-3))' }}>
                  <div>
                    <p className="text-sm font-medium text-foreground">{claim.id} · {claim.category.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-muted-foreground">{claim.business_purpose}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold mono text-foreground">{claim.currency} {claim.amount.toFixed(2)}</p>
                    <StatusBadge status={claim.status} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
