import { useParams, Link } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { StatusBadge } from '@/components/StatusBadge';
import { employees } from '@/data/mockData';
import { ArrowLeft, FileText, User, Clock, CheckCircle2, XCircle, AlertCircle, DollarSign, Paperclip } from 'lucide-react';

const statusSteps = [
  { key: 'submitted', label: 'Submitted', icon: Clock },
  { key: 'manager_approved', label: 'Manager Approved', icon: CheckCircle2 },
  { key: 'finance_validated', label: 'Finance Validated', icon: DollarSign },
  { key: 'paid', label: 'Paid', icon: CheckCircle2 },
];

const ClaimDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { claims, approvals } = useData();

  const claim = claims.find(c => c.id === id);
  if (!claim) {
    return (
      <div className="animate-fade-in space-y-4">
        <Link to="/claims" className="btn-glass text-xs"><ArrowLeft className="w-4 h-4" /> Back to Claims</Link>
        <div className="glass-card p-8 text-center text-muted-foreground">Claim not found.</div>
      </div>
    );
  }

  const claimant = employees.find(e => e.id === claim.claimant_id);
  const claimApprovals = approvals.filter(a => a.claim_id === claim.id);
  const manager = claimant ? employees.find(e => e.id === claimant.manager_id) : null;

  // Build audit timeline
  const timeline: { date: string; title: string; description: string; icon: typeof Clock; color: string }[] = [];

  timeline.push({
    date: claim.submitted_at,
    title: 'Claim Submitted',
    description: `${claimant?.full_name || 'Unknown'} submitted a ${claim.category.replace(/_/g, ' ')} claim for ${claim.currency} ${claim.amount.toFixed(2)}`,
    icon: FileText,
    color: 'var(--info)',
  });

  claimApprovals.forEach(apr => {
    const approver = employees.find(e => e.id === apr.approver_id);
    const decisionMap = {
      approve: { title: 'Manager Approved', color: 'var(--positive)', icon: CheckCircle2 },
      reject: { title: 'Rejected', color: 'var(--negative)', icon: XCircle },
      needs_info: { title: 'More Info Requested', color: 'var(--warning)', icon: AlertCircle },
    };
    const d = decisionMap[apr.decision];
    timeline.push({
      date: apr.decided_at,
      title: d.title,
      description: `${approver?.full_name || 'Unknown'}: "${apr.comment}"`,
      icon: d.icon,
      color: d.color,
    });
  });

  if (claim.status === 'finance_validated') {
    timeline.push({
      date: claim.updated_at,
      title: 'Finance Validated',
      description: 'Claim validated for policy compliance. Payment pending.',
      icon: DollarSign,
      color: 'var(--positive)',
    });
  }

  if (claim.status === 'paid') {
    timeline.push({
      date: claim.updated_at,
      title: 'Payment Processed',
      description: 'Reimbursement included in payroll cycle.',
      icon: CheckCircle2,
      color: 'var(--positive)',
    });
  }

  timeline.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Status progress
  const statusOrder = ['submitted', 'manager_approved', 'finance_validated', 'paid'];
  const currentStepIdx = statusOrder.indexOf(claim.status);
  const isTerminal = ['rejected', 'needs_info'].includes(claim.status);

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Back link */}
      <Link to="/claims" className="btn-glass text-xs inline-flex">
        <ArrowLeft className="w-4 h-4" /> Back to Claims
      </Link>

      {/* Header */}
      <div className="kpi-card">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="mono text-sm text-muted-foreground">{claim.id}</span>
              <StatusBadge status={claim.status} />
            </div>
            <h1 className="text-xl font-bold text-foreground">{claim.category.replace(/_/g, ' ')}</h1>
            <p className="text-sm text-muted-foreground mt-1">{claim.business_purpose}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold mono text-foreground">{claim.currency} {claim.amount.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-1">{new Date(claim.expense_date).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          </div>
        </div>

        {/* Progress bar */}
        {!isTerminal && (
          <div className="mt-6 flex items-center gap-0">
            {statusSteps.map((step, i) => {
              const isActive = i <= currentStepIdx;
              const isCurrent = i === currentStepIdx;
              return (
                <div key={step.key} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isCurrent ? 'animate-glow' : ''}`}
                      style={{
                        background: isActive ? 'hsl(var(--primary) / 0.2)' : 'hsl(var(--surface-3))',
                        color: isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                        border: isActive ? '2px solid hsl(var(--primary) / 0.4)' : '2px solid hsl(var(--border))',
                      }}
                    >
                      <step.icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] mt-1 text-center whitespace-nowrap" style={{ color: isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))' }}>
                      {step.label}
                    </span>
                  </div>
                  {i < statusSteps.length - 1 && (
                    <div className="flex-1 h-0.5 mx-2 rounded-full" style={{ background: i < currentStepIdx ? 'hsl(var(--primary))' : 'hsl(var(--border))' }} />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {isTerminal && (
          <div className="mt-4 rounded-xl p-3 flex items-center gap-2" style={{ background: claim.status === 'rejected' ? 'hsl(var(--negative-muted))' : 'hsl(var(--warning-muted))' }}>
            {claim.status === 'rejected' ? <XCircle className="w-4 h-4" style={{ color: 'hsl(var(--negative))' }} /> : <AlertCircle className="w-4 h-4" style={{ color: 'hsl(var(--warning))' }} />}
            <span className="text-sm font-medium" style={{ color: claim.status === 'rejected' ? 'hsl(var(--negative))' : 'hsl(var(--warning))' }}>
              {claim.status === 'rejected' ? 'This claim was rejected.' : 'Additional information has been requested.'}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Details panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Claim info */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Claim Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ['Category', claim.category.replace(/_/g, ' ')],
                ['Payment Method', claim.payment_method.replace(/_/g, ' ')],
                ['Expense Date', new Date(claim.expense_date).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })],
                ['Submitted', new Date(claim.submitted_at).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })],
                ['Claimant', claimant?.full_name || 'Unknown'],
                ['Approver', manager?.full_name || 'N/A'],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="font-medium text-foreground capitalize">{value}</p>
                </div>
              ))}
              {claim.attendees && (
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Attendees</p>
                  <p className="font-medium text-foreground">{claim.attendees}</p>
                </div>
              )}
              {claim.project_code && (
                <div>
                  <p className="text-xs text-muted-foreground">Project Code</p>
                  <p className="font-medium mono text-foreground">{claim.project_code}</p>
                </div>
              )}
            </div>
          </div>

          {/* Receipt preview */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Paperclip className="w-4 h-4" /> Receipts
            </h3>
            {claim.receipt_files.length === 0 ? (
              <div className="rounded-xl p-4 text-center" style={{ background: 'hsl(var(--warning-muted))' }}>
                <AlertCircle className="w-5 h-5 mx-auto mb-2" style={{ color: 'hsl(var(--warning))' }} />
                <p className="text-sm font-medium" style={{ color: 'hsl(var(--warning))' }}>No receipts attached</p>
                <p className="text-xs text-muted-foreground mt-1">Receipt required for reimbursement</p>
              </div>
            ) : (
              <div className="space-y-2">
                {claim.receipt_files.map((file, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'hsl(var(--surface-3))' }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'hsl(var(--primary) / 0.15)' }}>
                      <FileText className="w-5 h-5" style={{ color: 'hsl(var(--primary))' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{file}</p>
                      <p className="text-xs text-muted-foreground">{file.endsWith('.pdf') ? 'PDF Document' : 'Image File'}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">Uploaded</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Audit timeline */}
        <div className="space-y-4">
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Audit Timeline
            </h3>
            <div className="space-y-0">
              {timeline.map((event, i) => (
                <div key={i} className="flex gap-3">
                  {/* Line */}
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: `hsl(${event.color} / 0.15)` }}>
                      <event.icon className="w-3.5 h-3.5" style={{ color: `hsl(${event.color})` }} />
                    </div>
                    {i < timeline.length - 1 && <div className="w-px flex-1 min-h-[24px]" style={{ background: 'hsl(var(--border))' }} />}
                  </div>
                  <div className="pb-5">
                    <p className="text-sm font-medium text-foreground">{event.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{event.description}</p>
                    <p className="text-[10px] text-muted-foreground mt-1 mono">
                      {new Date(event.date).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })} · {new Date(event.date).toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Manager comments */}
          {claimApprovals.length > 0 && (
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <User className="w-4 h-4" /> Manager Comments
              </h3>
              <div className="space-y-3">
                {claimApprovals.map(apr => {
                  const approver = employees.find(e => e.id === apr.approver_id);
                  return (
                    <div key={apr.id} className="rounded-xl p-3" style={{ background: 'hsl(var(--surface-3))' }}>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: 'hsl(var(--primary) / 0.15)', color: 'hsl(var(--primary))' }}>
                          {approver?.full_name?.charAt(0) || '?'}
                        </div>
                        <span className="text-xs font-medium text-foreground">{approver?.full_name || 'Unknown'}</span>
                        <StatusBadge status={apr.decision === 'approve' ? 'manager_approved' : apr.decision === 'reject' ? 'rejected' : 'needs_info'} />
                      </div>
                      <p className="text-sm text-muted-foreground italic">"{apr.comment}"</p>
                      <p className="text-[10px] text-muted-foreground mt-1 mono">
                        {new Date(apr.decided_at).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClaimDetail;
