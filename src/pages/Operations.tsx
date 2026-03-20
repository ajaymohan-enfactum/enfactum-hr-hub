import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Upload, Store, Settings, Search, BookOpen } from 'lucide-react';
import { StaggerContainer, StaggerItem } from '@/components/motion/MotionPrimitives';
import { StatusBadge } from '@/components/StatusBadge';

const Operations = () => {
  const { vendors, vendorServices, rateCards, adminSettings, setAdminSettings, policyRules } = useData();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [gchatUrl, setGchatUrl] = useState(adminSettings.google_chat_webhook_url);
  const [waKey, setWaKey] = useState(adminSettings.whatsapp_provider_key);
  const [domainFilter, setDomainFilter] = useState('all');

  const handleSaveSettings = () => {
    setAdminSettings({ google_chat_webhook_url: gchatUrl, whatsapp_provider_key: waKey });
    toast({ title: 'Settings saved' });
  };

  const filteredRules = policyRules.filter(r => domainFilter === 'all' || r.policy_domain === domainFilter);

  return (
    <StaggerContainer className="space-y-6">
      <StaggerItem><h1 className="text-2xl font-bold text-foreground">Operations</h1><p className="text-sm text-muted-foreground">Import Center, Vendors, Rate Cards, Policy Rules & Settings</p></StaggerItem>
      <StaggerItem>
        <Tabs defaultValue="import">
          <TabsList className="flex-wrap">
            <TabsTrigger value="import">Import Center</TabsTrigger>
            <TabsTrigger value="vendors">Vendors & Suppliers</TabsTrigger>
            <TabsTrigger value="rates">Internal Rate Card</TabsTrigger>
            <TabsTrigger value="rules">Policy Rules</TabsTrigger>
            <TabsTrigger value="settings">Policy & Integrations</TabsTrigger>
          </TabsList>

          <TabsContent value="import" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[{ label: 'Import Employees', desc: 'CSV or Google Sheet link' }, { label: 'Import Payslips', desc: 'Employee + month + Drive link' }, { label: 'Import Insurance', desc: 'Employee insurance mapping' }].map(item => (
                <div key={item.label} className="glass-card p-5 space-y-3 cursor-pointer hover:brightness-110 transition-all">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'hsl(var(--primary) / 0.15)' }}><Upload className="w-5 h-5" style={{ color: 'hsl(var(--primary))' }} /></div>
                  <p className="font-semibold text-sm text-foreground">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p>
                  <div className="border-2 border-dashed rounded-xl p-4 text-center" style={{ borderColor: 'hsl(var(--border))' }}><p className="text-xs text-muted-foreground">Drop file or paste Google Sheets URL</p></div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="vendors" className="mt-4 space-y-4">
            <div className="glass-card overflow-hidden">
              <table className="w-full data-table"><thead><tr><th>Vendor</th><th>Country</th><th>Category</th><th>Contact</th><th>Terms</th><th>Status</th></tr></thead>
                <tbody>{vendors.map(v => (<tr key={v.id}><td><p className="font-medium text-foreground">{v.vendor_name}</p><p className="text-xs text-muted-foreground">{v.contact_email}</p></td><td className="text-muted-foreground">{v.country}</td><td className="text-muted-foreground">{v.service_category}</td><td className="text-muted-foreground">{v.contact_name}</td><td className="text-muted-foreground">{v.payment_terms}</td><td><StatusBadge status={v.status === 'active' ? 'resolved' : 'closed'} /></td></tr>))}</tbody></table>
            </div>
            <h3 className="text-sm font-semibold text-foreground">Vendor Services</h3>
            <div className="glass-card overflow-hidden">
              <table className="w-full data-table"><thead><tr><th>Vendor</th><th>Service</th><th>Unit</th><th>Rate</th><th>Currency</th></tr></thead>
                <tbody>{vendorServices.map(vs => { const vendor = vendors.find(v => v.id === vs.vendor_id); return (<tr key={vs.id}><td className="text-muted-foreground">{vendor?.vendor_name || '—'}</td><td className="font-medium text-foreground">{vs.service_name}</td><td className="text-muted-foreground capitalize">{vs.unit_type}</td><td className="mono text-foreground">{vs.default_rate.toLocaleString()}</td><td className="text-muted-foreground">{vs.currency}</td></tr>); })}</tbody></table>
            </div>
          </TabsContent>

          <TabsContent value="rates" className="mt-4">
            <div className="glass-card overflow-hidden">
              <table className="w-full data-table"><thead><tr><th>Role</th><th>Country</th><th>Rate/Hour</th><th>Currency</th><th>Effective</th></tr></thead>
                <tbody>{rateCards.map(rc => (<tr key={rc.id}><td className="font-medium text-foreground">{rc.role}</td><td className="text-muted-foreground">{rc.country}</td><td className="mono text-foreground">{rc.rate_per_hour}</td><td className="text-muted-foreground">{rc.currency}</td><td className="text-xs text-muted-foreground">{rc.effective_from} – {rc.effective_to}</td></tr>))}</tbody></table>
            </div>
          </TabsContent>

          {/* Policy Rules */}
          <TabsContent value="rules" className="mt-4 space-y-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-4 h-4" style={{ color: 'hsl(var(--primary))' }} />
              <h3 className="text-sm font-semibold text-foreground">Policy Rules Engine</h3>
              <Select value={domainFilter} onValueChange={setDomainFilter}><SelectTrigger className="w-[140px] ml-auto"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Domains</SelectItem><SelectItem value="claims">Claims</SelectItem><SelectItem value="leave">Leave</SelectItem><SelectItem value="payroll">Payroll</SelectItem><SelectItem value="vendor">Vendor</SelectItem><SelectItem value="onboarding">Onboarding</SelectItem><SelectItem value="exit">Exit</SelectItem></SelectContent></Select>
            </div>
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full data-table">
                  <thead><tr><th>Domain</th><th>Country</th><th>Category</th><th>Receipt</th><th>Window</th><th>Max Amt</th><th>Approval</th><th>Active</th><th>Notes</th></tr></thead>
                  <tbody>{filteredRules.map(r => (
                    <tr key={r.id}>
                      <td><span className="text-xs rounded-full px-2 py-0.5 capitalize" style={{ background: 'hsl(var(--surface-4))', color: 'hsl(var(--foreground))' }}>{r.policy_domain}</span></td>
                      <td className="text-muted-foreground">{r.country}</td>
                      <td className="text-foreground capitalize">{r.category}</td>
                      <td>{r.receipt_required === true ? <span style={{ color: 'hsl(var(--positive))' }}>Yes</span> : r.receipt_required === false ? 'No' : '—'}</td>
                      <td className="mono text-muted-foreground">{r.submission_window_days ?? '—'}</td>
                      <td className="mono text-foreground">{r.max_amount ? `${r.currency || ''} ${r.max_amount}` : '—'}</td>
                      <td className="text-xs text-muted-foreground capitalize">{r.approval_chain.replace(/_/g, ' ')}</td>
                      <td>{r.is_active ? <span style={{ color: 'hsl(var(--positive))' }}>✓</span> : <span style={{ color: 'hsl(var(--negative))' }}>✗</span>}</td>
                      <td className="text-xs text-muted-foreground max-w-[200px] truncate">{r.notes}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-4 space-y-4">
            <div className="glass-card p-5 space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2"><Settings className="w-4 h-4" /> Notification Integrations</h3>
              <div className="space-y-3">
                <div className="space-y-2"><Label>Google Chat Webhook URL</Label><Input value={gchatUrl} onChange={e => setGchatUrl(e.target.value)} placeholder="https://chat.googleapis.com/v1/spaces/..." /><p className="text-xs text-muted-foreground">Approvals, onboarding reminders, exceptions, month-end tasks</p></div>
                <div className="space-y-2"><Label>WhatsApp Provider Key</Label><Input value={waKey} onChange={e => setWaKey(e.target.value)} placeholder="Provider API key" type="password" /><p className="text-xs text-muted-foreground">Employee status updates only</p></div>
                <button className="btn-primary text-sm" onClick={handleSaveSettings}>Save Settings</button>
              </div>
            </div>
            <div className="glass-card p-5 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Notification Routing</h3>
              <div className="space-y-2">
                {[{ channel: 'Google Chat', events: 'Pending approvals, overdue onboarding tasks, open exceptions, month-end close tasks due' }, { channel: 'WhatsApp', events: 'Claim status updates, onboarding welcome, exit milestones' }].map(item => (
                  <div key={item.channel} className="rounded-xl p-3 flex items-start gap-3" style={{ background: 'hsl(var(--surface-3))' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'hsl(var(--primary) / 0.15)' }}><Store className="w-4 h-4" style={{ color: 'hsl(var(--primary))' }} /></div>
                    <div><p className="text-sm font-medium text-foreground">{item.channel}</p><p className="text-xs text-muted-foreground">{item.events}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </StaggerItem>
    </StaggerContainer>
  );
};

export default Operations;
