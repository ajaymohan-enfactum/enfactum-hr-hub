import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { employees } from '@/data/mockData';
import { Shield, ExternalLink, Phone } from 'lucide-react';
import { StaggerContainer, StaggerItem } from '@/components/motion/MotionPrimitives';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Insurance = () => {
  const { currentUser } = useAuth();
  const { insurancePolicies, employeeInsurance } = useData();

  const myInsurance = employeeInsurance.filter(ei => ei.employee_id === currentUser.id);
  const myPolicies = myInsurance.map(ei => {
    const policy = insurancePolicies.find(p => p.id === ei.insurance_policy_id);
    return { ...ei, policy };
  });

  return (
    <StaggerContainer className="space-y-6">
      <StaggerItem>
        <h1 className="text-2xl font-bold text-foreground">{currentUser.is_hr_admin ? 'Insurance Management' : 'My Insurance'}</h1>
        <p className="text-sm text-muted-foreground">{currentUser.is_hr_admin ? 'Manage policies and employee mappings' : 'View your insurance coverage and details'}</p>
      </StaggerItem>

      {!currentUser.is_hr_admin ? (
        /* Employee view */
        <StaggerItem>
          {myPolicies.length === 0 ? (
            <div className="glass-card p-6 text-center text-muted-foreground">No insurance policies found for your profile. Contact HR for assistance.</div>
          ) : (
            <div className="space-y-4">
              {myPolicies.map(mp => mp.policy && (
                <div key={mp.id} className="glass-card p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'hsl(var(--primary) / 0.15)' }}>
                        <Shield className="w-5 h-5" style={{ color: 'hsl(var(--primary))' }} />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{mp.policy.policy_name}</p>
                        <p className="text-xs text-muted-foreground">{mp.policy.insurer_name} · {mp.policy.policy_number}</p>
                      </div>
                    </div>
                    <span className="text-xs rounded-full px-2 py-0.5" style={{ background: 'hsl(var(--surface-4))', color: 'hsl(var(--foreground))' }}>
                      {mp.policy.country}
                    </span>
                  </div>

                  <div className="rounded-xl p-3" style={{ background: 'hsl(var(--surface-3))' }}>
                    <p className="text-sm text-foreground">{mp.policy.coverage_summary}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div><span className="text-muted-foreground">Member ID:</span> <span className="mono text-foreground">{mp.member_id}</span></div>
                    <div><span className="text-muted-foreground">Dependents:</span> <span className="text-foreground">{mp.dependents_summary}</span></div>
                    <div><span className="text-muted-foreground">Effective:</span> <span className="text-foreground">{new Date(mp.effective_from).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })} – {new Date(mp.effective_to).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
                  </div>

                  <div className="flex gap-2">
                    <a href={mp.policy.portal_link} target="_blank" rel="noopener noreferrer" className="btn-glass text-xs">
                      <ExternalLink className="w-3.5 h-3.5" /> Portal
                    </a>
                    <a href={mp.policy.document_link} target="_blank" rel="noopener noreferrer" className="btn-glass text-xs">
                      <ExternalLink className="w-3.5 h-3.5" /> Policy Doc
                    </a>
                    <span className="btn-ghost text-xs cursor-default">
                      <Phone className="w-3.5 h-3.5" /> {mp.policy.hotline}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </StaggerItem>
      ) : (
        /* HR Admin view */
        <StaggerItem>
          <Tabs defaultValue="policies">
            <TabsList>
              <TabsTrigger value="policies">Policies ({insurancePolicies.length})</TabsTrigger>
              <TabsTrigger value="mapping">Employee Mapping ({employeeInsurance.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="policies" className="mt-4">
              <div className="glass-card overflow-hidden">
                <table className="w-full data-table">
                  <thead>
                    <tr><th>Insurer</th><th>Policy Name</th><th>Number</th><th>Country</th><th>Hotline</th></tr>
                  </thead>
                  <tbody>
                    {insurancePolicies.map(p => (
                      <tr key={p.id}>
                        <td className="font-medium text-foreground">{p.insurer_name}</td>
                        <td className="text-foreground">{p.policy_name}</td>
                        <td className="mono text-muted-foreground">{p.policy_number}</td>
                        <td className="text-muted-foreground">{p.country}</td>
                        <td className="text-muted-foreground">{p.hotline}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="mapping" className="mt-4">
              <div className="glass-card overflow-hidden">
                <table className="w-full data-table">
                  <thead>
                    <tr><th>Employee</th><th>Policy</th><th>Member ID</th><th>Dependents</th><th>Effective</th></tr>
                  </thead>
                  <tbody>
                    {employeeInsurance.map(ei => {
                      const emp = employees.find(e => e.id === ei.employee_id);
                      const pol = insurancePolicies.find(p => p.id === ei.insurance_policy_id);
                      return (
                        <tr key={ei.id}>
                          <td className="font-medium text-foreground">{emp?.full_name || '—'}</td>
                          <td className="text-muted-foreground">{pol?.policy_name || '—'}</td>
                          <td className="mono text-muted-foreground">{ei.member_id}</td>
                          <td className="text-muted-foreground">{ei.dependents_summary}</td>
                          <td className="text-xs text-muted-foreground">{new Date(ei.effective_from).toLocaleDateString('en-SG', { month: 'short', year: 'numeric' })} – {new Date(ei.effective_to).toLocaleDateString('en-SG', { month: 'short', year: 'numeric' })}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </StaggerItem>
      )}
    </StaggerContainer>
  );
};

export default Insurance;
