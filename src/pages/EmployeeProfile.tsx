import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { employees } from '@/data/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusBadge } from '@/components/StatusBadge';
import { StaggerContainer, StaggerItem } from '@/components/motion/MotionPrimitives';
import { User, Receipt, Calendar, Shield, CreditCard, ClipboardList, UserMinus, FolderOpen, ExternalLink, Plus } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const EmployeeProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const { claims, leaveRequests, employeeInsurance, insurancePolicies, payrollLineItems, payrollRuns, onboardingCases, onboardingTasks, exitCases, ffSettlements, driveLinks, setDriveLinks } = useData();
  const { toast } = useToast();
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  const emp = employees.find(e => e.id === id);
  if (!emp) return <div className="glass-card p-6 text-center text-muted-foreground">Employee not found.</div>;

  // Access control
  const canView = currentUser.id === emp.id || currentUser.is_hr_admin || currentUser.is_finance ||
    (currentUser.is_manager && emp.manager_id === currentUser.id);
  if (!canView) return <div className="glass-card p-6 text-center text-muted-foreground">You don't have permission to view this profile.</div>;

  const empClaims = claims.filter(c => c.claimant_id === emp.id);
  const empLeaves = leaveRequests.filter(l => l.requester_id === emp.id);
  const empInsurance = employeeInsurance.filter(ei => ei.employee_id === emp.id).map(ei => ({ ...ei, policy: insurancePolicies.find(p => p.id === ei.insurance_policy_id) }));
  const empPayslips = payrollLineItems.filter(li => li.employee_id === emp.id && li.status === 'ready');
  const empOnboarding = onboardingCases.find(c => c.employee_id === emp.id && c.status !== 'complete');
  const empOnbTasks = empOnboarding ? onboardingTasks.filter(t => t.onboarding_case_id === empOnboarding.id) : [];
  const empExit = exitCases.find(c => c.employee_id === emp.id && c.status !== 'closed');
  const empFF = empExit ? ffSettlements.find(f => f.exit_case_id === empExit.id) : null;
  const empDriveLinks = driveLinks.filter(dl => dl.employee_id === emp.id);
  const managerName = emp.manager_id ? employees.find(e => e.id === emp.manager_id)?.full_name || '—' : '—';
  const ytdTotal = empClaims.filter(c => c.status === 'paid' || c.status === 'finance_validated').reduce((s, c) => s + c.amount, 0);

  const handleAddDriveLink = () => {
    if (!newLinkTitle || !newLinkUrl) return;
    setDriveLinks(prev => [...prev, { id: `dl-${Date.now()}`, link_type: 'other', employee_id: emp.id, related_entity_type: null, related_entity_id: null, title: newLinkTitle, drive_url: newLinkUrl, created_by: currentUser.id, created_at: new Date().toISOString() }]);
    setNewLinkTitle(''); setNewLinkUrl('');
    toast({ title: 'Drive link added' });
  };

  return (
    <StaggerContainer className="space-y-6">
      <StaggerItem>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold" style={{ background: 'var(--gradient-primary)', color: 'hsl(var(--primary-foreground))' }}>
            {emp.full_name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{emp.full_name}</h1>
            <p className="text-sm text-muted-foreground">{emp.role_title} · {emp.department} · {emp.country}</p>
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge status={emp.lifecycle_status} />
              <span className="text-xs text-muted-foreground capitalize">{emp.employment_type.replace('_', ' ')}</span>
              {emp.employee_code && <span className="text-xs mono text-muted-foreground">{emp.employee_code}</span>}
            </div>
          </div>
        </div>
      </StaggerItem>

      <StaggerItem>
        <Tabs defaultValue="overview">
          <TabsList className="flex-wrap">
            <TabsTrigger value="overview"><User className="w-3.5 h-3.5 mr-1" />Overview</TabsTrigger>
            <TabsTrigger value="claims"><Receipt className="w-3.5 h-3.5 mr-1" />Claims</TabsTrigger>
            <TabsTrigger value="leave"><Calendar className="w-3.5 h-3.5 mr-1" />Leave</TabsTrigger>
            <TabsTrigger value="insurance"><Shield className="w-3.5 h-3.5 mr-1" />Insurance</TabsTrigger>
            <TabsTrigger value="payslips"><CreditCard className="w-3.5 h-3.5 mr-1" />Payslips</TabsTrigger>
            {emp.lifecycle_status === 'new_hire' && <TabsTrigger value="onboarding"><ClipboardList className="w-3.5 h-3.5 mr-1" />Onboarding</TabsTrigger>}
            {['exit_initiated', 'exited'].includes(emp.lifecycle_status) && <TabsTrigger value="exit"><UserMinus className="w-3.5 h-3.5 mr-1" />Exit</TabsTrigger>}
            <TabsTrigger value="documents"><FolderOpen className="w-3.5 h-3.5 mr-1" />Documents</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="mt-4">
            <div className="glass-card p-5">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                {[
                  ['Email', emp.email], ['Manager', managerName], ['Start Date', new Date(emp.start_date).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })],
                  ['Country', emp.country], ['Cost Center', emp.cost_center || '—'], ['Lifecycle', emp.lifecycle_status],
                  ['Personal Email', emp.personal_email || '—'], ['Phone', emp.phone || '—'], ['Payboy ID', emp.payboy_employee_id || '—'],
                ].map(([label, value]) => (
                  <div key={label as string}><p className="text-xs text-muted-foreground">{label}</p><p className="font-medium text-foreground">{value}</p></div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Claims */}
          <TabsContent value="claims" className="mt-4 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="kpi-card"><p className="text-xs text-muted-foreground">Total Claims</p><p className="text-xl font-bold mono text-foreground">{empClaims.length}</p></div>
              <div className="kpi-card"><p className="text-xs text-muted-foreground">YTD Approved</p><p className="text-xl font-bold mono text-foreground">SGD {ytdTotal.toLocaleString()}</p></div>
              <div className="kpi-card"><p className="text-xs text-muted-foreground">Pending</p><p className="text-xl font-bold mono text-foreground">{empClaims.filter(c => ['submitted', 'needs_info'].includes(c.status)).length}</p></div>
            </div>
            <div className="glass-card overflow-hidden">
              <table className="w-full data-table"><thead><tr><th>ID</th><th>Category</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead>
                <tbody>{empClaims.slice(0, 10).map(c => (
                  <tr key={c.id}><td><Link to={`/claims/${c.id}`} className="mono text-foreground hover:underline">{c.id}</Link></td>
                    <td className="text-muted-foreground capitalize">{c.category.replace(/_/g, ' ')}</td>
                    <td className="mono text-foreground">{c.currency} {c.amount.toFixed(2)}</td>
                    <td className="text-xs text-muted-foreground">{new Date(c.expense_date).toLocaleDateString('en-SG', { day: 'numeric', month: 'short' })}</td>
                    <td><StatusBadge status={c.status} /></td></tr>
                ))}</tbody></table>
            </div>
          </TabsContent>

          {/* Leave */}
          <TabsContent value="leave" className="mt-4">
            <div className="glass-card overflow-hidden">
              {empLeaves.length === 0 ? <div className="p-6 text-center text-muted-foreground text-sm">No leave/WFH requests.</div> :
                <table className="w-full data-table"><thead><tr><th>Type</th><th>Dates</th><th>Reason</th><th>Status</th></tr></thead>
                  <tbody>{empLeaves.map(l => (
                    <tr key={l.id}><td className="text-foreground">{l.request_type}</td>
                      <td className="text-xs text-muted-foreground">{new Date(l.start_date).toLocaleDateString('en-SG', { day: 'numeric', month: 'short' })} – {new Date(l.end_date).toLocaleDateString('en-SG', { day: 'numeric', month: 'short' })}</td>
                      <td className="text-muted-foreground">{l.reason}</td>
                      <td><StatusBadge status={l.status} /></td></tr>
                  ))}</tbody></table>}
            </div>
          </TabsContent>

          {/* Insurance */}
          <TabsContent value="insurance" className="mt-4 space-y-3">
            {empInsurance.length === 0 ? <div className="glass-card p-6 text-center text-muted-foreground">No insurance policies mapped.</div> :
              empInsurance.map(ei => ei.policy && (
                <div key={ei.id} className="glass-card p-4">
                  <p className="font-medium text-foreground">{ei.policy.policy_name}</p>
                  <p className="text-xs text-muted-foreground">{ei.policy.insurer_name} · {ei.member_id}</p>
                  <p className="text-xs text-muted-foreground mt-1">{ei.policy.coverage_summary}</p>
                  <div className="flex gap-2 mt-2">
                    <a href={ei.policy.portal_link} target="_blank" rel="noopener noreferrer" className="btn-glass text-xs"><ExternalLink className="w-3 h-3" /> Portal</a>
                    <a href={ei.policy.document_link} target="_blank" rel="noopener noreferrer" className="btn-glass text-xs"><ExternalLink className="w-3 h-3" /> Doc</a>
                  </div>
                </div>
              ))}
          </TabsContent>

          {/* Payslips */}
          <TabsContent value="payslips" className="mt-4">
            <div className="glass-card overflow-hidden">
              {empPayslips.length === 0 ? <div className="p-6 text-center text-muted-foreground text-sm">No payslips available.</div> :
                <table className="w-full data-table"><thead><tr><th>Month</th><th>Gross</th><th>Net</th><th>Link</th></tr></thead>
                  <tbody>{empPayslips.map(li => {
                    const run = payrollRuns.find(r => r.id === li.payroll_run_id);
                    return (<tr key={li.id}><td className="text-foreground">{run?.payroll_month || '—'}</td>
                      <td className="mono text-muted-foreground">{li.gross_pay.toLocaleString()}</td>
                      <td className="mono font-semibold text-foreground">{li.net_pay.toLocaleString()}</td>
                      <td>{li.payslip_link ? <a href={li.payslip_link} target="_blank" rel="noopener noreferrer" className="btn-glass text-xs py-1 px-2"><ExternalLink className="w-3 h-3" /> View</a> : '—'}</td></tr>);
                  })}</tbody></table>}
            </div>
          </TabsContent>

          {/* Onboarding */}
          {emp.lifecycle_status === 'new_hire' && (
            <TabsContent value="onboarding" className="mt-4 space-y-3">
              {empOnboarding ? (<>
                <div className="glass-card p-4">
                  <div className="flex justify-between"><div><p className="font-medium text-foreground">{empOnboarding.role} · {empOnboarding.country}</p>
                    <p className="text-xs text-muted-foreground">Start: {new Date(empOnboarding.start_date).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })}</p></div>
                    <StatusBadge status={empOnboarding.status === 'in_progress' ? 'in_progress' : empOnboarding.status === 'complete' ? 'resolved' : 'open'} /></div>
                  <div className="flex items-center gap-2 mt-2"><div className="flex-1 h-2 rounded-full" style={{ background: 'hsl(var(--surface-4))' }}>
                    <div className="h-full rounded-full" style={{ width: `${empOnbTasks.length ? (empOnbTasks.filter(t => t.status === 'done').length / empOnbTasks.length * 100) : 0}%`, background: 'var(--gradient-accent)' }} /></div>
                    <span className="text-xs mono text-muted-foreground">{empOnbTasks.filter(t => t.status === 'done').length}/{empOnbTasks.length}</span></div>
                </div>
                {empOnbTasks.map(t => (
                  <div key={t.id} className="glass-card p-3 flex items-center justify-between">
                    <div><p className="text-sm text-foreground">{t.task_name}</p><p className="text-xs text-muted-foreground">{t.owner_role} · Due: {new Date(t.due_date).toLocaleDateString('en-SG', { day: 'numeric', month: 'short' })}</p></div>
                    <StatusBadge status={t.status === 'done' ? 'resolved' : t.status === 'doing' ? 'in_progress' : 'open'} />
                  </div>))}
              </>) : <div className="glass-card p-6 text-center text-muted-foreground">No active onboarding case.</div>}
            </TabsContent>
          )}

          {/* Exit */}
          {['exit_initiated', 'exited'].includes(emp.lifecycle_status) && (
            <TabsContent value="exit" className="mt-4 space-y-3">
              {empExit ? (<>
                <div className="glass-card p-4">
                  <p className="font-medium text-foreground">Exit Case</p>
                  <p className="text-xs text-muted-foreground">Resigned: {new Date(empExit.resignation_date).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })} · LWD: {new Date(empExit.last_working_day).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  <p className="text-xs text-muted-foreground">Reason: {empExit.exit_reason}</p>
                  <StatusBadge status={empExit.status === 'initiated' ? 'open' : empExit.status === 'in_progress' ? 'in_progress' : 'closed'} />
                </div>
                {empFF && (
                  <div className="glass-card p-4">
                    <p className="font-medium text-foreground mb-2">Full & Final Settlement</p>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div><span className="text-muted-foreground">Payable:</span> <span className="mono text-foreground">{empFF.payable_amount.toLocaleString()}</span></div>
                      <div><span className="text-muted-foreground">Deductions:</span> <span className="mono text-foreground">{empFF.deductions.toLocaleString()}</span></div>
                      <div><span className="text-muted-foreground">Net:</span> <span className="mono font-semibold text-foreground">{empFF.net_amount.toLocaleString()}</span></div>
                    </div>
                    <StatusBadge status={empFF.status === 'paid' ? 'paid' : empFF.status === 'pending_approval' ? 'submitted' : 'draft'} />
                  </div>
                )}
              </>) : <div className="glass-card p-6 text-center text-muted-foreground">No exit case found.</div>}
            </TabsContent>
          )}

          {/* Documents */}
          <TabsContent value="documents" className="mt-4 space-y-4">
            {/* Folder links */}
            <div className="glass-card p-4 space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Drive Folders</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { label: 'Employee Folder', url: emp.employee_drive_folder_url },
                  { label: 'Payslips', url: emp.payslips_folder_url },
                  { label: 'Insurance', url: emp.insurance_folder_url },
                  { label: 'Onboarding', url: emp.onboarding_folder_url },
                  { label: 'Exit', url: emp.exit_folder_url },
                ].filter(f => f.url).map(f => (
                  <a key={f.label} href={f.url!} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 rounded-lg hover:brightness-110 transition-all" style={{ background: 'hsl(var(--surface-3))' }}>
                    <FolderOpen className="w-4 h-4" style={{ color: 'hsl(var(--primary))' }} />
                    <span className="text-sm text-foreground">{f.label}</span>
                    <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
                  </a>
                ))}
              </div>
            </div>
            {/* Drive links list */}
            <div className="glass-card p-4 space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Documents</h3>
              {empDriveLinks.length === 0 ? <p className="text-sm text-muted-foreground">No documents linked.</p> :
                <div className="space-y-1">{empDriveLinks.map(dl => (
                  <a key={dl.id} href={dl.drive_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 rounded-lg hover:brightness-110" style={{ background: 'hsl(var(--surface-3))' }}>
                    <span className="text-xs rounded-full px-2 py-0.5" style={{ background: 'hsl(var(--surface-4))', color: 'hsl(var(--muted-foreground))' }}>{dl.link_type.replace(/_/g, ' ')}</span>
                    <span className="text-sm text-foreground flex-1">{dl.title}</span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                  </a>
                ))}</div>}
              {(currentUser.is_hr_admin || currentUser.is_finance) && (
                <div className="flex gap-2 mt-3">
                  <Input placeholder="Title" value={newLinkTitle} onChange={e => setNewLinkTitle(e.target.value)} className="text-sm" />
                  <Input placeholder="Drive URL" value={newLinkUrl} onChange={e => setNewLinkUrl(e.target.value)} className="text-sm" />
                  <button className="btn-glass text-xs shrink-0" onClick={handleAddDriveLink}><Plus className="w-3.5 h-3.5" /> Add</button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </StaggerItem>
    </StaggerContainer>
  );
};

export default EmployeeProfile;
