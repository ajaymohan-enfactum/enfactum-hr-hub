import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '@/lib/supabase';
import { EncrewEmployee, Certification } from '@/types/encrew';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Eye, EyeOff, Pencil } from 'lucide-react';
import { StaggerContainer, StaggerItem } from '@/components/motion/MotionPrimitives';

const statusColors: Record<string, string> = {
  active: 'hsl(var(--positive))',
  onboarding: 'hsl(var(--info))',
  on_leave: 'hsl(var(--warning))',
  exited: 'hsl(var(--muted-foreground))',
};
const statusBg: Record<string, string> = {
  active: 'hsl(var(--positive-muted))',
  onboarding: 'hsl(var(--info-muted))',
  on_leave: 'hsl(var(--warning-muted))',
  exited: 'hsl(var(--muted))',
};

const EmployeeProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [emp, setEmp] = useState<EncrewEmployee | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCtc, setShowCtc] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await db.from('employees' as any).select('*').eq('id', id).single();
      setEmp(data as unknown as EncrewEmployee | null);
      setLoading(false);
    };
    fetch();
  }, [id]);

  if (loading) return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading…</div>;
  if (!emp) return <div className="flex items-center justify-center h-64 text-muted-foreground">Employee not found</div>;

  const certs = (emp.certifications as Certification[] | null) || [];

  return (
    <StaggerContainer className="space-y-6">
      <StaggerItem>
        <Button variant="ghost" size="sm" onClick={() => navigate('/people')} className="text-muted-foreground mb-2">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to People
        </Button>
      </StaggerItem>

      <StaggerItem>
        <div className="glass-card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-foreground">{emp.name}</h1>
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize"
                  style={{ background: statusBg[emp.status], color: statusColors[emp.status] }}
                >
                  {emp.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{emp.designation} · {emp.department}</p>
              {emp.date_of_joining && (
                <p className="text-xs text-muted-foreground mt-1">
                  Joined {new Date(emp.date_of_joining).toLocaleDateString('en-SG', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              )}
            </div>
            <Button onClick={() => navigate(`/people/${emp.id}/edit`)} className="btn-glass">
              <Pencil className="w-4 h-4" /> Edit
            </Button>
          </div>
        </div>
      </StaggerItem>

      <StaggerItem>
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="glass-card p-6 mt-4 grid sm:grid-cols-2 gap-6">
              {[
                { label: 'Role', value: emp.role },
                { label: 'Email', value: emp.email },
                { label: 'Department', value: emp.department },
                { label: 'Designation', value: emp.designation },
                { label: 'Date of Joining', value: emp.date_of_joining ? new Date(emp.date_of_joining).toLocaleDateString('en-SG', { day: 'numeric', month: 'long', year: 'numeric' }) : '—' },
              ].map(row => (
                <div key={row.label}>
                  <p className="text-xs text-muted-foreground mb-1">{row.label}</p>
                  <p className="text-sm text-foreground">{row.value}</p>
                </div>
              ))}
              <div>
                <p className="text-xs text-muted-foreground mb-1">Monthly CTC</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm mono text-foreground">
                    {showCtc ? (emp.monthly_ctc != null ? `$${emp.monthly_ctc.toLocaleString()}` : '—') : '••••••'}
                  </p>
                  <button onClick={() => setShowCtc(!showCtc)} className="text-muted-foreground hover:text-foreground">
                    {showCtc ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="skills">
            <div className="glass-card p-6 mt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">Skills ({emp.skills?.length || 0})</h3>
                <Button onClick={() => navigate(`/people/${emp.id}/edit`)} size="sm" className="btn-glass text-xs">
                  Edit Skills
                </Button>
              </div>
              {emp.skills && emp.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {emp.skills.map(s => (
                    <span key={s} className="rounded-full px-3 py-1 text-xs font-medium" style={{ background: 'hsl(var(--info-muted))', color: 'hsl(var(--info))' }}>
                      {s}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No skills added yet</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="certifications">
            <div className="glass-card p-6 mt-4">
              <h3 className="text-sm font-semibold text-foreground mb-4">Certifications ({certs.length})</h3>
              {certs.length === 0 ? (
                <p className="text-sm text-muted-foreground">No certifications recorded</p>
              ) : (
                <div className="space-y-3">
                  {certs.map((c, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'hsl(var(--surface-3))' }}>
                      <div>
                        <p className="text-sm font-medium text-foreground">{c.name}</p>
                        <p className="text-xs text-muted-foreground">Issued by {c.issued_by}</p>
                      </div>
                      <div className="text-right">
                        <span
                          className="rounded-full px-2 py-0.5 text-xs font-semibold capitalize"
                          style={{
                            background: c.status === 'active' ? statusBg.active : c.status === 'expired' ? statusBg.exited : statusBg.onboarding,
                            color: c.status === 'active' ? statusColors.active : c.status === 'expired' ? statusColors.exited : statusColors.onboarding,
                          }}
                        >
                          {c.status}
                        </span>
                        {c.expiry_date && <p className="text-[10px] text-muted-foreground mt-1">Exp: {new Date(c.expiry_date).toLocaleDateString('en-SG', { month: 'short', year: 'numeric' })}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="projects">
            <div className="glass-card p-6 mt-4 text-center">
              <p className="text-sm text-muted-foreground">Projects tracking coming soon</p>
            </div>
          </TabsContent>

          <TabsContent value="timeline">
            <div className="glass-card p-6 mt-4 text-center">
              <p className="text-sm text-muted-foreground">Activity timeline coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </StaggerItem>
    </StaggerContainer>
  );
};

export default EmployeeProfile;
