import { cn } from '@/lib/utils';

const statusConfig: Record<string, { label: string; className: string }> = {
  draft: { label: 'Draft', className: 'badge-draft' },
  submitted: { label: 'Submitted', className: 'badge-submitted' },
  needs_info: { label: 'Needs Info', className: 'badge-needs-info' },
  rejected: { label: 'Rejected', className: 'badge-rejected' },
  manager_approved: { label: 'Manager Approved', className: 'badge-approved' },
  finance_validated: { label: 'Finance Validated', className: 'badge-approved' },
  paid: { label: 'Paid', className: 'badge-paid' },
  open: { label: 'Open', className: 'badge-open' },
  in_progress: { label: 'In Progress', className: 'badge-in-progress' },
  resolved: { label: 'Resolved', className: 'badge-resolved' },
  closed: { label: 'Closed', className: 'badge-closed' },
  completed: { label: 'Completed', className: 'badge-approved' },
};

export const StatusBadge = ({ status }: { status: string }) => {
  const config = statusConfig[status] || { label: status, className: 'badge-closed' };
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold', config.className)}>
      {config.label}
    </span>
  );
};
