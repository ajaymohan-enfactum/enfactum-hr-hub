import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { employees } from '@/data/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Upload, Store, DollarSign, Settings, Search, Plus } from 'lucide-react';
import { StaggerContainer, StaggerItem } from '@/components/motion/MotionPrimitives';
import { StatusBadge } from '@/components/StatusBadge';

const Operations = () => {
  const { vendors, vendorServices, rateCards, adminSettings, setAdminSettings } = useData();
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const [gchatUrl, setGchatUrl] = useState(adminSettings.google_chat_webhook_url);
  const [waKey, setWaKey] = useState(adminSettings.whatsapp_provider_key);

  const handleSaveSettings = () => {
    setAdminSettings({ google_chat_webhook_url: gchatUrl, whatsapp_provider_key: waKey });
    toast({ title: 'Settings saved', description: 'Notification settings updated.' });
  };

  return (
    <StaggerContainer className="space-y-6">
      <StaggerItem>
        <h1 className="text-2xl font-bold text-foreground">Operations</h1>
        <p className="text-sm text-muted-foreground">Import Center, Vendors, Rate Cards & Settings</p>
      </StaggerItem>

      <StaggerItem>
        <Tabs defaultValue="import">
          <TabsList className="flex-wrap">
            <TabsTrigger value="import">Import Center</TabsTrigger>
            <TabsTrigger value="vendors">Vendors & Suppliers</TabsTrigger>
            <TabsTrigger value="rates">Internal Rate Card</TabsTrigger>
            <TabsTrigger value="settings">Policy & Integrations</TabsTrigger>
          </TabsList>

          {/* Import Center */}
          <TabsContent value="import" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Import Employees', desc: 'CSV or Google Sheet link', icon: Upload },
                { label: 'Import Payslips', desc: 'Employee + month + Drive link', icon: Upload },
                { label: 'Import Insurance', desc: 'Employee insurance mapping', icon: Upload },
              ].map(item => (
                <div key={item.label} className="glass-card p-5 space-y-3 cursor-pointer hover:brightness-110 transition-all">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'hsl(var(--primary) / 0.15)' }}>
                    <item.icon className="w-5 h-5" style={{ color: 'hsl(var(--primary))' }} />
                  </div>
                  <p className="font-semibold text-sm text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                  <div className="border-2 border-dashed rounded-xl p-4 text-center" style={{ borderColor: 'hsl(var(--border))' }}>
                    <p className="text-xs text-muted-foreground">Drop file or paste Google Sheets URL</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-xl p-3 flex gap-2" style={{ background: 'hsl(var(--info-muted))' }}>
              <Search className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'hsl(var(--info))' }} />
              <div className="text-xs text-foreground">
                <p>Import preview will show column mapping, duplicate detection (by email), and a confirm step before updating records.</p>
              </div>
            </div>
          </TabsContent>

          {/* Vendors */}
          <TabsContent value="vendors" className="mt-4 space-y-4">
            <div className="glass-card overflow-hidden">
              <table className="w-full data-table">
                <thead>
                  <tr><th>Vendor</th><th>Country</th><th>Category</th><th>Contact</th><th>Payment Terms</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {vendors.map(v => (
                    <tr key={v.id}>
                      <td>
                        <p className="font-medium text-foreground">{v.vendor_name}</p>
                        <p className="text-xs text-muted-foreground">{v.contact_email}</p>
                      </td>
                      <td className="text-muted-foreground">{v.country}</td>
                      <td className="text-muted-foreground">{v.service_category}</td>
                      <td className="text-muted-foreground">{v.contact_name}</td>
                      <td className="text-muted-foreground">{v.payment_terms}</td>
                      <td><StatusBadge status={v.status === 'active' ? 'resolved' : 'closed'} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-sm font-semibold text-foreground">Vendor Services</h3>
            <div className="glass-card overflow-hidden">
              <table className="w-full data-table">
                <thead>
                  <tr><th>Vendor</th><th>Service</th><th>Unit</th><th>Rate</th><th>Currency</th></tr>
                </thead>
                <tbody>
                  {vendorServices.map(vs => {
                    const vendor = vendors.find(v => v.id === vs.vendor_id);
                    return (
                      <tr key={vs.id}>
                        <td className="text-muted-foreground">{vendor?.vendor_name || '—'}</td>
                        <td className="font-medium text-foreground">{vs.service_name}</td>
                        <td className="text-muted-foreground capitalize">{vs.unit_type}</td>
                        <td className="mono text-foreground">{vs.default_rate.toLocaleString()}</td>
                        <td className="text-muted-foreground">{vs.currency}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Rate Card */}
          <TabsContent value="rates" className="mt-4">
            <div className="glass-card overflow-hidden">
              <table className="w-full data-table">
                <thead>
                  <tr><th>Role</th><th>Country</th><th>Rate/Hour</th><th>Currency</th><th>Effective</th></tr>
                </thead>
                <tbody>
                  {rateCards.map(rc => (
                    <tr key={rc.id}>
                      <td className="font-medium text-foreground">{rc.role}</td>
                      <td className="text-muted-foreground">{rc.country}</td>
                      <td className="mono text-foreground">{rc.rate_per_hour}</td>
                      <td className="text-muted-foreground">{rc.currency}</td>
                      <td className="text-xs text-muted-foreground">{rc.effective_from} – {rc.effective_to}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Policy & Integrations */}
          <TabsContent value="settings" className="mt-4 space-y-4">
            <div className="glass-card p-5 space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Settings className="w-4 h-4" /> Notification Integrations
              </h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Google Chat Webhook URL</Label>
                  <Input value={gchatUrl} onChange={e => setGchatUrl(e.target.value)} placeholder="https://chat.googleapis.com/v1/spaces/..." />
                  <p className="text-xs text-muted-foreground">Used for: manager approvals, onboarding reminders, F&F approvals</p>
                </div>
                <div className="space-y-2">
                  <Label>WhatsApp Provider Key</Label>
                  <Input value={waKey} onChange={e => setWaKey(e.target.value)} placeholder="Provider API key" type="password" />
                  <p className="text-xs text-muted-foreground">Used for: employee status updates (claim status, onboarding, exit milestones)</p>
                </div>
                <button className="btn-primary text-sm" onClick={handleSaveSettings}>Save Settings</button>
              </div>
            </div>

            <div className="glass-card p-5 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Notification Routing</h3>
              <div className="space-y-2">
                {[
                  { channel: 'Google Chat', events: 'Manager approvals, Onboarding overdue reminders, F&F approvals, Weekly HR summary' },
                  { channel: 'WhatsApp', events: 'Claim submitted/approved/paid, Onboarding start reminders, Exit milestones' },
                ].map(item => (
                  <div key={item.channel} className="rounded-xl p-3 flex items-start gap-3" style={{ background: 'hsl(var(--surface-3))' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'hsl(var(--primary) / 0.15)' }}>
                      <Store className="w-4 h-4" style={{ color: 'hsl(var(--primary))' }} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.channel}</p>
                      <p className="text-xs text-muted-foreground">{item.events}</p>
                    </div>
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
