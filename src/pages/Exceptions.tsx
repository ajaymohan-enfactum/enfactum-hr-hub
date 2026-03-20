import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { employees } from '@/data/mockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/StatusBadge';
import { useToast } from '@/hooks/use-toast';
import { StaggerContainer, StaggerItem } from '@/components/motion/MotionPrimitives';
import { AlertTriangle, Search, CheckCircle, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const reasonLabels: Record<string, string> = { late_submission: 'Late Submission', missing_receipt: 'Missing Receipt', over_limit: 'Over Limit', non_standard_vendor: 'Non-Standard Vendor', missing_doc: 'Missing Doc', policy_conflict: 'Policy Conflict', other: 'Other' };
const entityLabels: Record<string, string> = { claim: 'Claim', payroll_line: 'Payroll', onboarding_task: 'Onboarding', exit_ff: 'Exit/F&F' };
const severityColors: Record<string, string> = { low: 'hsl(var(--info))', medium: 'hsl(var(--warning))', high: 'hsl(var(--negative))' };

const Exceptions = () => {
  const { exceptions, setExceptions } = useData();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [entityFilter, setEntityFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');

  const filtered = exceptions.filter(e => {
    if (severityFilter !== 'all' && e.severity !== severityFilter) return false;
    if (statusFilter !== 'all' && e.status !== statusFilter) return false;
    if (entityFilter !== 'all' && e.entity_type !== entityFilter) return false;
    if (countryFilter !== 'all' && e.country !== countryFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      const assignee = e.assigned_to ? employees.find(emp => emp.id === e.assigned_to)?.full_name || '' : '';
      return e.reason_notes.toLowerCase().includes(s) || e.entity_id.toLowerCase().includes(s) || assignee.toLowerCase().includes(s);
    }
    return true;
  });

  const openCount = exceptions.filter(e => e.status === 'open').length;
  const highCount = exceptions.filter(e => e.severity === 'high' && e.status !== 'resolved' && e.status !== 'waived').length;

  const handleResolve = (id: string) => {
    setExceptions(prev => prev.map(e => e.id === id ? { ...e, status: 'resolved' as const, resolved_at: new Date().toISOString() } : e));
    toast({ title: 'Exception resolved' });
  };
  const handleWaive = (id: string) => {
    setExceptions(prev => prev.map(e => e.id === id ? { ...e, status: 'waived' as const, resolved_at: new Date().toISOString() } : e));
    toast({ title: 'Exception waived' });
  };
  const handleAssign = (id: string) => {
    setExceptions(prev => prev.map(e => e.id === id ? { ...e, assigned_to: currentUser.id, status: 'in_review' as const } : e));
    toast({ title: 'Exception assigned to you' });
  };

  const getEntityLink = (type: string, entityId: string) => {
    if (type === 'claim') return `/claims/${entityId}`;
    return null;
  };

  return (
    <StaggerContainer className="space-y-6">
      <StaggerItem>
        <h1 className="text-2xl font-bold text-foreground">Exceptions</h1>
        <p className="text-sm text-muted-foreground">Review and resolve policy exceptions across all modules</p>
      </StaggerItem>

      <StaggerItem>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Open', value: openCount, color: 'warning' },
            { label: 'High Severity', value: highCount, color: 'negative' },
            { label: 'In Review', value: exceptions.filter(e => e.status === 'in_review').length, color: 'info' },
            { label: 'Resolved', value: exceptions.filter(e => e.status === 'resolved' || e.status === 'waived').length, color: 'positive' },
          ].map(kpi => (
            <div key={kpi.label} className="kpi-card">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `hsl(var(--${kpi.color}-muted))` }}>
                  <AlertTriangle className="w-3.5 h-3.5" style={{ color: `hsl(var(--${kpi.color}))` }} />
                </div>
                <span className="text-xs text-muted-foreground">{kpi.label}</span>
              </div>
              <p className="text-xl font-bold mono text-foreground">{kpi.value}</p>
            </div>
          ))}
        </div>
      </StaggerItem>

      <StaggerItem>
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={severityFilter} onValueChange={setSeverityFilter}><SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Severity</SelectItem><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem></SelectContent></Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="open">Open</SelectItem><SelectItem value="in_review">In Review</SelectItem><SelectItem value="resolved">Resolved</SelectItem><SelectItem value="waived">Waived</SelectItem></SelectContent></Select>
          <Select value={entityFilter} onValueChange={setEntityFilter}><SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Types</SelectItem><SelectItem value="claim">Claim</SelectItem><SelectItem value="payroll_line">Payroll</SelectItem><SelectItem value="onboarding_task">Onboarding</SelectItem><SelectItem value="exit_ff">Exit/F&F</SelectItem></SelectContent></Select>
          <Select value={countryFilter} onValueChange={setCountryFilter}><SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Countries</SelectItem><SelectItem value="Singapore">Singapore</SelectItem><SelectItem value="India">India</SelectItem><SelectItem value="Malaysia">Malaysia</SelectItem></SelectContent></Select>
        </div>
      </StaggerItem>

      <StaggerItem>
        <div className="space-y-3">
          {filtered.length === 0 ? <div className="glass-card p-6 text-center text-muted-foreground">No exceptions found.</div> :
            filtered.map(exc => {
              const assignee = exc.assigned_to ? employees.find(e => e.id === exc.assigned_to)?.full_name : null;
              const link = getEntityLink(exc.entity_type, exc.entity_id);
              return (
                <div key={exc.id} className="glass-card p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs rounded-full px-2 py-0.5 font-semibold" style={{ background: `${severityColors[exc.severity]}22`, color: severityColors[exc.severity] }}>{exc.severity.toUpperCase()}</span>
                        <span className="text-xs rounded-full px-2 py-0.5" style={{ background: 'hsl(var(--surface-4))', color: 'hsl(var(--foreground))' }}>{entityLabels[exc.entity_type]}</span>
                        <span className="text-xs rounded-full px-2 py-0.5" style={{ background: 'hsl(var(--surface-4))', color: 'hsl(var(--muted-foreground))' }}>{reasonLabels[exc.reason_code]}</span>
                        {exc.country && <span className="text-xs text-muted-foreground">{exc.country}</span>}
                      </div>
                      <p className="text-sm text-foreground mt-1">{exc.reason_notes}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span>Entity: <span className="mono">{exc.entity_id}</span></span>
                        {assignee && <span>Assigned: {assignee}</span>}
                        <span>{new Date(exc.created_at).toLocaleDateString('en-SG', { day: 'numeric', month: 'short' })}</span>
                      </div>
                    </div>
                    <StatusBadge status={exc.status === 'in_review' ? 'in_progress' : exc.status === 'waived' ? 'closed' : exc.status} />
                  </div>
                  <div className="flex gap-2">
                    {link && <Link to={link}><button className="btn-glass text-xs"><Eye className="w-3.5 h-3.5" /> View Entity</button></Link>}
                    {exc.status === 'open' && <button className="btn-glass text-xs" onClick={() => handleAssign(exc.id)}>Assign to me</button>}
                    {(exc.status === 'open' || exc.status === 'in_review') && <>
                      <button className="btn-primary text-xs" onClick={() => handleResolve(exc.id)}><CheckCircle className="w-3.5 h-3.5" /> Resolve</button>
                      <button className="btn-ghost text-xs" onClick={() => handleWaive(exc.id)}>Waive</button>
                    </>}
                  </div>
                </div>
              );
            })}
        </div>
      </StaggerItem>
    </StaggerContainer>
  );
};

export default Exceptions;
