import { useData } from '@/contexts/DataContext';
import { StaggerContainer, StaggerItem } from '@/components/motion/MotionPrimitives';
import { StatusBadge } from '@/components/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { employees } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Download, DollarSign, FileText, CreditCard } from 'lucide-react';
import { Claim } from '@/types/hr';

const FinanceConsole = () => {
  const { claims, setClaims } = useData();
  const { toast } = useToast();

  const toValidate = claims.filter(c => c.status === 'manager_approved');
  const toPay = claims.filter(c => c.status === 'finance_validated');
  const paid = claims.filter(c => c.status === 'paid');

  const getEmployeeName = (id: string) => employees.find(e => e.id === id)?.full_name || 'Unknown';

  const handleValidate = (claimId: string) => {
    setClaims(prev => prev.map(c => c.id === claimId ? { ...c, status: 'finance_validated' as const, updated_at: new Date().toISOString() } : c));
    toast({ title: 'Claim validated', description: 'Ready for payment.' });
  };

  const handleMarkPaid = (claimId: string) => {
    setClaims(prev => prev.map(c => c.id === claimId ? { ...c, status: 'paid' as const, updated_at: new Date().toISOString() } : c));
    toast({ title: 'Marked as paid', description: 'Employee will be notified.' });
  };

  const handleExport = () => {
    toast({ title: 'Export started', description: 'CSV download will begin shortly.' });
  };

  const renderClaimRow = (claim: Claim, actions: React.ReactNode) => (
    <div key={claim.id} className="glass-card p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="mono text-xs text-muted-foreground">{claim.id}</span>
            <StatusBadge status={claim.status} />
          </div>
          <p className="font-medium text-foreground mt-1">{getEmployeeName(claim.claimant_id)}</p>
          <p className="text-sm text-muted-foreground capitalize">{claim.category.replace(/_/g, ' ')} · {new Date(claim.expense_date).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          <p className="text-sm text-foreground">{claim.business_purpose}</p>
          <p className="text-xs text-muted-foreground mt-1">{claim.receipt_files.length > 0 ? '📎 Receipt' : '⚠️ No receipt'}</p>
        </div>
        <div className="text-right space-y-2">
          <p className="text-lg font-bold mono text-foreground">{claim.currency} {claim.amount.toFixed(2)}</p>
          {actions}
        </div>
      </div>
    </div>
  );

  return (
    <StaggerContainer className="space-y-6">
      <StaggerItem>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Finance Console</h1>
            <p className="text-muted-foreground text-sm">Validate and process claims</p>
          </div>
          <button className="btn-glass text-sm" onClick={handleExport}>
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </StaggerItem>

      <StaggerItem><div className="grid grid-cols-3 gap-4">
        <div className="kpi-card">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'hsl(var(--warning-muted))' }}>
              <FileText className="w-3.5 h-3.5" style={{ color: 'hsl(var(--warning))' }} />
            </div>
            <span className="text-xs text-muted-foreground">To Validate</span>
          </div>
          <p className="text-xl font-bold mono text-foreground">{toValidate.length}</p>
        </div>
        <div className="kpi-card">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'hsl(var(--info-muted))' }}>
              <CreditCard className="w-3.5 h-3.5" style={{ color: 'hsl(var(--info))' }} />
            </div>
            <span className="text-xs text-muted-foreground">To Pay</span>
          </div>
          <p className="text-xl font-bold mono text-foreground">{toPay.length}</p>
        </div>
        <div className="kpi-card">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'hsl(var(--positive-muted))' }}>
              <DollarSign className="w-3.5 h-3.5" style={{ color: 'hsl(var(--positive))' }} />
            </div>
            <span className="text-xs text-muted-foreground">Paid</span>
          </div>
          <p className="text-xl font-bold mono text-foreground">{paid.length}</p>
        </div>
      </div></StaggerItem>

      <StaggerItem><Tabs defaultValue="validate">
        <TabsList>
          <TabsTrigger value="validate">To Validate ({toValidate.length})</TabsTrigger>
          <TabsTrigger value="pay">To Pay ({toPay.length})</TabsTrigger>
          <TabsTrigger value="paid">Paid ({paid.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="validate" className="space-y-3 mt-4">
          {toValidate.length === 0 ? (
            <div className="glass-card p-6 text-center text-muted-foreground">No claims to validate.</div>
          ) : toValidate.map(c => renderClaimRow(c, (
            <button className="btn-primary text-xs" onClick={() => handleValidate(c.id)}>
              <CheckCircle className="w-4 h-4" /> Validate
            </button>
          )))}
        </TabsContent>
        <TabsContent value="pay" className="space-y-3 mt-4">
          {toPay.length === 0 ? (
            <div className="glass-card p-6 text-center text-muted-foreground">No claims to pay.</div>
          ) : toPay.map(c => renderClaimRow(c, (
            <button className="btn-primary text-xs" onClick={() => handleMarkPaid(c.id)}>
              <DollarSign className="w-4 h-4" /> Mark Paid
            </button>
          )))}
        </TabsContent>
        <TabsContent value="paid" className="space-y-3 mt-4">
          {paid.length === 0 ? (
            <div className="glass-card p-6 text-center text-muted-foreground">No paid claims yet.</div>
          ) : paid.map(c => renderClaimRow(c, <span className="text-xs text-muted-foreground">Processed</span>))}
        </TabsContent>
      </Tabs></StaggerItem>
    </StaggerContainer>
  );
};

export default FinanceConsole;
