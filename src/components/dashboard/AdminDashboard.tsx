import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { employees } from '@/data/mockData';
import { Link } from 'react-router-dom';
import { StatusBadge } from '@/components/StatusBadge';
import { Users, Receipt, Ticket, BookOpen, AlertCircle, ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useMemo } from 'react';
import { StaggerContainer, StaggerItem } from '@/components/motion/MotionPrimitives';

const ticketTypeLabels: Record<string, string> = {
  policy_question: 'Policy',
  grievance: 'Grievance',
  harassment: 'Harassment',
  IT_security: 'IT/Security',
  payroll: 'Payroll',
  benefits: 'Benefits',
  other: 'Other',
};

const ticketTypeColors: Record<string, string> = {
  policy_question: 'hsl(210, 100%, 58%)',
  grievance: 'hsl(0, 72%, 56%)',
  harassment: 'hsl(330, 70%, 56%)',
  IT_security: 'hsl(280, 70%, 62%)',
  payroll: 'hsl(38, 95%, 56%)',
  benefits: 'hsl(155, 60%, 46%)',
  other: 'hsl(215, 15%, 52%)',
};

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const { claims, tickets, leaveRequests, handbook } = useData();

  const activeEmployees = employees.filter(e => e.employment_status === 'active');
  const pendingClaimsOrg = claims.filter(c => ['submitted', 'needs_info'].includes(c.status));
  const unassignedTickets = tickets.filter(t => !t.assigned_to && (t.status === 'open' || t.status === 'in_progress'));
  const openTicketsAll = tickets.filter(t => t.status === 'open' || t.status === 'in_progress');
  const pendingLeaves = leaveRequests.filter(l => l.status === 'submitted');

  // Tickets by type donut
  const ticketDonut = useMemo(() => {
    const counts: Record<string, number> = {};
    tickets.forEach(t => { counts[t.ticket_type] = (counts[t.ticket_type] || 0) + 1; });
    return Object.entries(counts).map(([type, value]) => ({
      name: ticketTypeLabels[type] || type,
      value,
      color: ticketTypeColors[type] || 'hsl(215, 15%, 52%)',
    }));
  }, [tickets]);

  // Org-wide claims by status bar
  const claimStatusBar = useMemo(() => {
    const statusLabels: Record<string, string> = {
      draft: 'Draft', submitted: 'Submitted', needs_info: 'Info Needed',
      rejected: 'Rejected', manager_approved: 'Approved', finance_validated: 'Validated', paid: 'Paid',
    };
    const statusColors: Record<string, string> = {
      draft: 'hsl(215, 15%, 52%)', submitted: 'hsl(210, 100%, 58%)', needs_info: 'hsl(38, 95%, 56%)',
      rejected: 'hsl(0, 72%, 56%)', manager_approved: 'hsl(155, 60%, 46%)', finance_validated: 'hsl(180, 60%, 46%)', paid: 'hsl(280, 70%, 62%)',
    };
    const counts: Record<string, number> = {};
    claims.forEach(c => { counts[c.status] = (counts[c.status] || 0) + 1; });
    return Object.entries(counts).map(([status, value]) => ({
      name: statusLabels[status] || status,
      value,
      fill: statusColors[status] || 'hsl(215, 15%, 52%)',
    }));
  }, [claims]);

  return (
    <StaggerContainer className="space-y-6">
      {/* Header */}
      <StaggerItem>
        <h1 className="text-2xl font-bold text-foreground">HR Admin Console</h1>
        <p className="text-sm mt-1 text-muted-foreground">Welcome back, {currentUser.full_name} · Organisation overview</p>
      </StaggerItem>

      {/* Org KPIs */}
      <StaggerItem>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'Active Employees', value: activeEmployees.length, sub: `${employees.length} total`, color: 'primary' },
          { icon: Receipt, label: 'Pending Claims', value: pendingClaimsOrg.length, sub: `${claims.length} total org-wide`, color: 'warning' },
          { icon: Ticket, label: 'Open Tickets', value: openTicketsAll.length, sub: `${unassignedTickets.length} unassigned`, color: 'negative' },
          { icon: BookOpen, label: 'Handbook Sections', value: handbook.length, sub: 'Knowledge chunks', color: 'positive' },
        ].map(kpi => (
          <div key={kpi.label} className="kpi-card">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `hsl(var(--${kpi.color}-muted, var(--${kpi.color}) / 0.15))` }}>
                <kpi.icon className="w-4 h-4" style={{ color: `hsl(var(--${kpi.color}))` }} />
              </div>
              <span className="text-sm font-medium text-muted-foreground">{kpi.label}</span>
            </div>
            <p className="text-2xl font-bold mono text-foreground">{kpi.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>
      </StaggerItem>

      {/* Charts Row */}
      <StaggerItem>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Tickets by Type Donut */}
        <div className="kpi-card">
          <h3 className="text-sm font-semibold text-foreground mb-4">Tickets by Type</h3>
          <div className="flex items-center gap-4">
            <div className="w-40 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ticketDonut}
                    cx="50%" cy="50%"
                    innerRadius={40} outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {ticketDonut.map((entry, i) => (
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
              {ticketDonut.map((item, i) => (
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

        {/* Org Claims by Status Bar */}
        <div className="kpi-card">
          <h3 className="text-sm font-semibold text-foreground mb-4">Org-wide Claims Status</h3>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={claimStatusBar} barSize={28} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 18%, 20%)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: 'hsl(215, 15%, 52%)' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'hsl(215, 15%, 52%)' }} axisLine={false} tickLine={false} width={80} />
                <Tooltip
                  contentStyle={{ background: 'hsl(220, 22%, 10%)', border: '1px solid hsl(220, 18%, 20%)', borderRadius: '12px', fontSize: '12px', color: 'hsl(210, 20%, 93%)' }}
                  itemStyle={{ color: 'hsl(210, 20%, 93%)' }}
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {claimStatusBar.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      </StaggerItem>

      {/* Unassigned Tickets Queue */}
      <StaggerItem>
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" style={{ color: 'hsl(var(--warning))' }} />
            <h3 className="text-sm font-semibold text-foreground">Unassigned Tickets</h3>
          </div>
          <Link to="/tickets">
            <button className="btn-glass text-xs">View all tickets <ArrowRight className="w-3 h-3" /></button>
          </Link>
        </div>
        {unassignedTickets.length === 0 ? (
          <p className="text-sm text-muted-foreground">All tickets are assigned. 🎉</p>
        ) : (
          <div className="space-y-2">
            {unassignedTickets.map(ticket => {
              const requester = employees.find(e => e.id === ticket.requester_id);
              return (
                <div key={ticket.id} className="flex items-center justify-between p-3 rounded-xl transition-all hover:brightness-110" style={{ background: 'hsl(var(--surface-3))' }}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs mono text-muted-foreground">{ticket.id}</span>
                      <span className="text-xs rounded-full px-2 py-0.5" style={{ background: 'hsl(var(--surface-4))', color: 'hsl(var(--muted-foreground))' }}>
                        {ticketTypeLabels[ticket.ticket_type] || ticket.ticket_type}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-foreground mt-0.5 truncate">{ticket.subject}</p>
                    <p className="text-xs text-muted-foreground">by {requester?.full_name || 'Unknown'}</p>
                  </div>
                  <StatusBadge status={ticket.status} />
                </div>
              );
            })}
          </div>
        )}
      </div>
      </StaggerItem>

      {/* Quick Admin Links */}
      <StaggerItem>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { to: '/handbook', icon: BookOpen, label: 'Handbook Manager', sub: 'Edit & import policies' },
          { to: '/tickets', icon: Ticket, label: 'All Tickets', sub: `${openTicketsAll.length} open` },
          { to: '/leave-wfh', icon: Users, label: 'Leave Overview', sub: `${pendingLeaves.length} pending requests` },
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
      </StaggerItem>
    </StaggerContainer>
  );
};

export default AdminDashboard;
