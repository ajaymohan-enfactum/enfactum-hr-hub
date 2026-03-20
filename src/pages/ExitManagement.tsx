import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { employees } from '@/data/mockData';
import { StatusBadge } from '@/components/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { UserMinus, DollarSign, CheckCircle, AlertTriangle } from 'lucide-react';
import { StaggerContainer, StaggerItem } from '@/components/motion/MotionPrimitives';

const ExitManagement = () => {
  const { currentUser } = useAuth();
  const { exitCases, setExitCases, ffSettlements, setFFSettlements } = useData();
  const { toast } = useToast();

  const getEmployeeName = (id: string) => employees.find(e => e.id === id)?.full_name || 'Unknown';

  const activeCases = exitCases.filter(c => c.status !== 'closed');
  const closedCases = exitCases.filter(c => c.status === 'closed');
  const pendingFF = ffSettlements.filter(f => f.status !== 'paid');

  const handleApproveFF = (ffId: string) => {
    setFFSettlements(prev => prev.map(f => f.id === ffId ? { ...f, status: 'paid' as const, payout_date: new Date().toISOString().split('T')[0] } : f));
    toast({ title: 'Settlement approved', description: 'F&F marked as paid.' });
  };

  return (
    <StaggerContainer className="space-y-6">
      <StaggerItem>
        <h1 className="text-2xl font-bold text-foreground">Exit Management</h1>
        <p className="text-sm text-muted-foreground">Manage employee exits and full & final settlements</p>
      </StaggerItem>

      <StaggerItem>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: UserMinus, label: 'Active Exits', value: activeCases.length, color: 'warning' },
            { icon: CheckCircle, label: 'Closed', value: closedCases.length, color: 'positive' },
            { icon: DollarSign, label: 'Pending F&F', value: pendingFF.length, color: 'info' },
            { icon: AlertTriangle, label: 'AIS Impact', value: ffSettlements.filter(f => f.ais_impact_flag).length, color: 'negative' },
          ].map(kpi => (
            <div key={kpi.label} className="kpi-card">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `hsl(var(--${kpi.color}-muted))` }}>
                  <kpi.icon className="w-3.5 h-3.5" style={{ color: `hsl(var(--${kpi.color}))` }} />
                </div>
                <span className="text-xs text-muted-foreground">{kpi.label}</span>
              </div>
              <p className="text-xl font-bold mono text-foreground">{kpi.value}</p>
            </div>
          ))}
        </div>
      </StaggerItem>

      <StaggerItem>
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active ({activeCases.length})</TabsTrigger>
            <TabsTrigger value="ff">F&F Settlements ({ffSettlements.length})</TabsTrigger>
            <TabsTrigger value="closed">Closed ({closedCases.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-3 mt-4">
            {activeCases.length === 0 ? (
              <div className="glass-card p-6 text-center text-muted-foreground">No active exit cases.</div>
            ) : activeCases.map(ec => {
              const emp = employees.find(e => e.id === ec.employee_id);
              const ff = ffSettlements.find(f => f.exit_case_id === ec.id);
              return (
                <div key={ec.id} className="glass-card p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-foreground">{emp?.full_name || 'Unknown'}</p>
                      <p className="text-sm text-muted-foreground">{emp?.role_title} · {emp?.department}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Resigned: {new Date(ec.resignation_date).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })} ·
                        LWD: {new Date(ec.last_working_day).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      <p className="text-xs text-muted-foreground">Reason: {ec.exit_reason}</p>
                    </div>
                    <StatusBadge status={ec.status === 'initiated' ? 'open' : ec.status === 'in_progress' ? 'in_progress' : 'resolved'} />
                  </div>
                  {ff && (
                    <div className="rounded-xl p-3 mt-2" style={{ background: 'hsl(var(--surface-3))' }}>
                      <p className="text-xs font-semibold text-foreground mb-1">Full & Final Settlement</p>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div><span className="text-muted-foreground">Payable:</span> <span className="mono text-foreground">{ff.country === 'Singapore' ? 'SGD' : ff.country === 'India' ? 'INR' : 'MYR'} {ff.payable_amount.toLocaleString()}</span></div>
                        <div><span className="text-muted-foreground">Deductions:</span> <span className="mono text-foreground">{ff.deductions.toLocaleString()}</span></div>
                        <div><span className="text-muted-foreground">Net:</span> <span className="mono font-semibold text-foreground">{ff.net_amount.toLocaleString()}</span></div>
                      </div>
                      {ff.ais_impact_flag && <p className="text-xs mt-1" style={{ color: 'hsl(var(--warning))' }}>⚠ AIS impact (Singapore)</p>}
                      <div className="flex items-center justify-between mt-2">
                        <StatusBadge status={ff.status === 'draft' ? 'draft' : ff.status === 'pending_approval' ? 'submitted' : 'paid'} />
                        {(currentUser.is_finance || currentUser.is_hr_admin) && ff.status !== 'paid' && (
                          <button className="btn-primary text-xs" onClick={() => handleApproveFF(ff.id)}>
                            <CheckCircle className="w-3.5 h-3.5" /> Approve & Pay
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </TabsContent>

          <TabsContent value="ff" className="mt-4">
            <div className="glass-card overflow-hidden">
              <table className="w-full data-table">
                <thead>
                  <tr><th>Employee</th><th>Country</th><th>Payable</th><th>Deductions</th><th>Net</th><th>AIS</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {ffSettlements.map(ff => {
                    const ec = exitCases.find(e => e.id === ff.exit_case_id);
                    return (
                      <tr key={ff.id}>
                        <td className="font-medium text-foreground">{ec ? getEmployeeName(ec.employee_id) : '—'}</td>
                        <td className="text-muted-foreground">{ff.country}</td>
                        <td className="mono text-foreground">{ff.payable_amount.toLocaleString()}</td>
                        <td className="mono text-foreground">{ff.deductions.toLocaleString()}</td>
                        <td className="mono font-semibold text-foreground">{ff.net_amount.toLocaleString()}</td>
                        <td>{ff.ais_impact_flag ? <span style={{ color: 'hsl(var(--warning))' }}>Yes</span> : '—'}</td>
                        <td><StatusBadge status={ff.status === 'draft' ? 'draft' : ff.status === 'pending_approval' ? 'submitted' : 'paid'} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="closed" className="space-y-3 mt-4">
            {closedCases.length === 0 ? (
              <div className="glass-card p-6 text-center text-muted-foreground">No closed exit cases.</div>
            ) : closedCases.map(ec => {
              const emp = employees.find(e => e.id === ec.employee_id);
              return (
                <div key={ec.id} className="glass-card p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-foreground">{emp?.full_name || 'Unknown'}</p>
                      <p className="text-sm text-muted-foreground">{emp?.role_title} · LWD: {new Date(ec.last_working_day).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <StatusBadge status="closed" />
                  </div>
                </div>
              );
            })}
          </TabsContent>
        </Tabs>
      </StaggerItem>
    </StaggerContainer>
  );
};

export default ExitManagement;
