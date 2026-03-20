import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { employees } from '@/data/mockData';
import { StatusBadge } from '@/components/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { DollarSign, FileText, CheckCircle, ExternalLink } from 'lucide-react';
import { StaggerContainer, StaggerItem } from '@/components/motion/MotionPrimitives';

const Payroll = () => {
  const { currentUser } = useAuth();
  const { payrollRuns, payrollLineItems } = useData();
  const [countryFilter, setCountryFilter] = useState<string>('all');

  const isAdmin = currentUser.is_finance || currentUser.is_hr_admin;

  // Employee: My Payslips
  const myPayslips = payrollLineItems.filter(li => li.employee_id === currentUser.id && li.status === 'ready');

  // Admin: filtered runs
  const filteredRuns = payrollRuns.filter(r => countryFilter === 'all' || r.country === countryFilter);

  return (
    <StaggerContainer className="space-y-6">
      <StaggerItem>
        <h1 className="text-2xl font-bold text-foreground">{isAdmin ? 'Payroll Dashboard' : 'My Payslips'}</h1>
        <p className="text-sm text-muted-foreground">{isAdmin ? 'Manage payroll runs across countries' : 'View your monthly payslips'}</p>
      </StaggerItem>

      {!isAdmin ? (
        /* Employee: Payslips list */
        <StaggerItem>
          {myPayslips.length === 0 ? (
            <div className="glass-card p-6 text-center text-muted-foreground">No payslips available yet.</div>
          ) : (
            <div className="space-y-3">
              {myPayslips.map(li => {
                const run = payrollRuns.find(r => r.id === li.payroll_run_id);
                return (
                  <div key={li.id} className="glass-card p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{run?.payroll_month || '—'}</p>
                        <p className="text-xs text-muted-foreground">{run?.country} · Pay date: {run?.pay_date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold mono text-foreground">SGD {li.net_pay.toLocaleString()}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">Gross: {li.gross_pay.toLocaleString()}</span>
                          {li.payslip_link && (
                            <a href={li.payslip_link} target="_blank" rel="noopener noreferrer" className="btn-glass text-xs py-1 px-2">
                              <ExternalLink className="w-3 h-3" /> View
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </StaggerItem>
      ) : (
        /* Admin: Payroll runs */
        <>
          <StaggerItem>
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: FileText, label: 'Preparing', value: payrollRuns.filter(r => r.status === 'preparing').length, color: 'warning' },
                { icon: CheckCircle, label: 'Submitted', value: payrollRuns.filter(r => r.status === 'submitted').length, color: 'info' },
                { icon: DollarSign, label: 'Complete', value: payrollRuns.filter(r => r.status === 'complete').length, color: 'positive' },
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
            <div className="flex items-center gap-3 mb-4">
              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger className="w-[150px]"><SelectValue placeholder="Country" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  <SelectItem value="Singapore">Singapore</SelectItem>
                  <SelectItem value="India">India</SelectItem>
                  <SelectItem value="Malaysia">Malaysia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {filteredRuns.map(run => {
                const items = payrollLineItems.filter(li => li.payroll_run_id === run.id);
                const readyCount = items.filter(i => i.status === 'ready').length;
                return (
                  <div key={run.id} className="glass-card p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-foreground">{run.country} — {run.payroll_month}</p>
                        <p className="text-xs text-muted-foreground">Pay date: {run.pay_date} · {readyCount}/{items.length} employees ready</p>
                        {run.country === 'Singapore' && run.ais_submission_status && (
                          <p className="text-xs mt-1">
                            <span className="text-muted-foreground">AIS: </span>
                            <span style={{ color: run.ais_submission_status === 'accepted' ? 'hsl(var(--positive))' : run.ais_submission_status === 'submitted' ? 'hsl(var(--info))' : 'hsl(var(--warning))' }}>
                              {run.ais_submission_status.replace('_', ' ')}
                            </span>
                          </p>
                        )}
                        {run.notes && <p className="text-xs text-muted-foreground italic">{run.notes}</p>}
                      </div>
                      <StatusBadge status={run.status === 'preparing' ? 'in_progress' : run.status === 'submitted' ? 'submitted' : 'paid'} />
                    </div>

                    {/* Employee line items */}
                    {items.length > 0 && (
                      <div className="overflow-x-auto">
                        <table className="w-full data-table text-xs">
                          <thead>
                            <tr><th>Employee</th><th>Gross</th><th>Allowances</th><th>Deductions</th><th>Net</th><th>Status</th></tr>
                          </thead>
                          <tbody>
                            {items.map(li => (
                              <tr key={li.id}>
                                <td className="text-foreground">{employees.find(e => e.id === li.employee_id)?.full_name || '—'}</td>
                                <td className="mono">{li.gross_pay.toLocaleString()}</td>
                                <td className="mono">{li.allowances.toLocaleString()}</td>
                                <td className="mono">{li.deductions.toLocaleString()}</td>
                                <td className="mono font-semibold">{li.net_pay.toLocaleString()}</td>
                                <td><StatusBadge status={li.status === 'ready' ? 'resolved' : 'open'} /></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </StaggerItem>
        </>
      )}
    </StaggerContainer>
  );
};

export default Payroll;
