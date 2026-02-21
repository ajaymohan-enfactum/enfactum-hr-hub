import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ClaimCategory, PaymentMethod } from '@/types/hr';
import { AlertCircle, Upload } from 'lucide-react';

const categories: { value: ClaimCategory; label: string }[] = [
  { value: 'business_travel', label: 'Business Travel' },
  { value: 'ground_transport', label: 'Ground Transport' },
  { value: 'meals_travel', label: 'Meals (Travel)' },
  { value: 'client_meeting_meals', label: 'Client Meeting Meals' },
  { value: 'client_entertainment', label: 'Client Entertainment' },
  { value: 'professional_development', label: 'Professional Development' },
  { value: 'home_office_supplies', label: 'Home Office Supplies' },
  { value: 'phone_internet', label: 'Phone & Internet' },
  { value: 'other', label: 'Other' },
];

const paymentMethods: { value: PaymentMethod; label: string }[] = [
  { value: 'personal_cash', label: 'Personal Cash' },
  { value: 'personal_card', label: 'Personal Card' },
  { value: 'company_card', label: 'Company Card' },
];

const SubmitClaim = () => {
  const { currentUser } = useAuth();
  const { setClaims, claims } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [category, setCategory] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState('');
  const [purpose, setPurpose] = useState('');
  const [attendees, setAttendees] = useState('');
  const [projectCode, setProjectCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [hasReceipt, setHasReceipt] = useState(false);

  const isMealCategory = ['meals_travel', 'client_meeting_meals', 'client_entertainment'].includes(category);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !amount || !expenseDate || !purpose || !paymentMethod) {
      toast({ title: 'Missing fields', description: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }
    if (!hasReceipt && category !== 'other') {
      toast({ title: 'Receipt required', description: 'A receipt is required for all expense categories.', variant: 'destructive' });
      return;
    }
    if (isMealCategory && !attendees.trim()) {
      toast({ title: 'Attendees required', description: 'Please list attendees for meal expenses.', variant: 'destructive' });
      return;
    }

    const newClaim = {
      id: `CLM-${String(claims.length + 1).padStart(3, '0')}`,
      claimant_id: currentUser.id,
      category: category as ClaimCategory,
      amount: parseFloat(amount),
      currency: 'SGD',
      expense_date: expenseDate,
      business_purpose: purpose,
      attendees: attendees || undefined,
      project_code: projectCode || undefined,
      payment_method: paymentMethod as PaymentMethod,
      receipt_required: true,
      receipt_files: hasReceipt ? ['receipt_uploaded.pdf'] : [],
      status: 'submitted' as const,
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setClaims(prev => [newClaim, ...prev]);
    toast({ title: 'Claim submitted', description: `${newClaim.id} submitted for manager approval.` });
    navigate('/claims');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Submit Expense Claim</h1>
        <p className="text-muted-foreground text-sm">All fields marked * are required</p>
      </div>

      <div className="flex gap-2 p-3 rounded-lg bg-accent-muted border border-accent-muted">
        <AlertCircle className="w-4 h-4 text-accent mt-0.5 shrink-0" />
        <div className="text-xs text-foreground space-y-1">
          <p>• Submit within <strong>30 days</strong> of expense date</p>
          <p>• <strong>Receipt required</strong> for all expenses</p>
          <p>• Include attendee names for meal expenses</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Claim Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Amount (SGD) *</Label>
                <Input type="number" step="0.01" min="0" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Expense Date *</Label>
                <Input type="date" value={expenseDate} onChange={e => setExpenseDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Payment Method *</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Business Purpose *</Label>
              <Textarea value={purpose} onChange={e => setPurpose(e.target.value)} placeholder="Describe the business purpose..." rows={3} />
            </div>

            {isMealCategory && (
              <div className="space-y-2">
                <Label>Attendees *</Label>
                <Input value={attendees} onChange={e => setAttendees(e.target.value)} placeholder="Names of all attendees" />
              </div>
            )}

            <div className="space-y-2">
              <Label>Project Code (optional)</Label>
              <Input value={projectCode} onChange={e => setProjectCode(e.target.value)} placeholder="e.g. PRJ-001" />
            </div>

            <div className="space-y-2">
              <Label>Receipt Upload *</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${hasReceipt ? 'border-accent bg-accent-muted' : 'border-border hover:border-accent'}`}
                onClick={() => setHasReceipt(!hasReceipt)}
              >
                <Upload className={`w-8 h-8 mx-auto mb-2 ${hasReceipt ? 'text-accent' : 'text-muted-foreground'}`} />
                <p className="text-sm text-foreground">{hasReceipt ? '✓ Receipt attached' : 'Click to attach receipt'}</p>
                <p className="text-xs text-muted-foreground mt-1">{hasReceipt ? 'Click to remove' : 'PDF, JPG, PNG (max 10MB)'}</p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1">Submit Claim</Button>
              <Button type="button" variant="outline" onClick={() => navigate('/claims')}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmitClaim;
