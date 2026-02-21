import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { employees } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Download, DollarSign } from 'lucide-react';
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
    <Card key={claim.id}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">{claim.id}</span>
              <StatusBadge status={claim.status} />
            </div>
            <p className="font-medium text-foreground mt-1">{getEmployeeName(claim.claimant_id)}</p>
            <p className="text-sm text-muted-foreground">{claim.category.replace(/_/g, ' ')} · {new Date(claim.expense_date).toLocaleDateString()}</p>
            <p className="text-sm text-foreground">{claim.business_purpose}</p>
            <p className="text-xs text-muted-foreground mt-1">{claim.receipt_files.length > 0 ? '📎 Receipt' : '⚠️ No receipt'}</p>
          </div>
          <div className="text-right space-y-2">
            <p className="text-lg font-bold text-foreground">{claim.currency} {claim.amount.toFixed(2)}</p>
            {actions}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Finance Console</h1>
          <p className="text-muted-foreground text-sm">Validate and process claims</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="w-4 h-4 mr-1" /> Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">{toValidate.length}</p><p className="text-xs text-muted-foreground">To Validate</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">{toPay.length}</p><p className="text-xs text-muted-foreground">To Pay</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">{paid.length}</p><p className="text-xs text-muted-foreground">Paid</p></CardContent></Card>
      </div>

      <Tabs defaultValue="validate">
        <TabsList>
          <TabsTrigger value="validate">To Validate ({toValidate.length})</TabsTrigger>
          <TabsTrigger value="pay">To Pay ({toPay.length})</TabsTrigger>
          <TabsTrigger value="paid">Paid ({paid.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="validate" className="space-y-3 mt-4">
          {toValidate.length === 0 ? (
            <Card><CardContent className="p-6 text-center text-muted-foreground">No claims to validate.</CardContent></Card>
          ) : toValidate.map(c => renderClaimRow(c, (
            <Button size="sm" onClick={() => handleValidate(c.id)}>
              <CheckCircle className="w-4 h-4 mr-1" /> Validate
            </Button>
          )))}
        </TabsContent>
        <TabsContent value="pay" className="space-y-3 mt-4">
          {toPay.length === 0 ? (
            <Card><CardContent className="p-6 text-center text-muted-foreground">No claims to pay.</CardContent></Card>
          ) : toPay.map(c => renderClaimRow(c, (
            <Button size="sm" onClick={() => handleMarkPaid(c.id)}>
              <DollarSign className="w-4 h-4 mr-1" /> Mark Paid
            </Button>
          )))}
        </TabsContent>
        <TabsContent value="paid" className="space-y-3 mt-4">
          {paid.length === 0 ? (
            <Card><CardContent className="p-6 text-center text-muted-foreground">No paid claims yet.</CardContent></Card>
          ) : paid.map(c => renderClaimRow(c, <span className="text-xs text-muted-foreground">Processed</span>))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinanceConsole;
