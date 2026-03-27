import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { StaggerContainer, StaggerItem } from '@/components/motion/MotionPrimitives';
import { useEffect } from 'react';
import { EncrewEmployee } from '@/types/encrew';

const AddEmployee = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const { employee: currentEmp } = useAuth();
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    designation: '',
    status: 'active' as string,
    date_of_joining: '',
    monthly_ctc: '',
    skillsInput: '',
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const fetch = async () => {
        const { data } = await db.from('employees').select('*').eq('id', id).single();
        if (data) {
          const emp = data as unknown as EncrewEmployee;
          setForm({
            name: emp.name,
            email: emp.email,
            role: emp.role,
            department: emp.department,
            designation: emp.designation,
            status: emp.status,
            date_of_joining: emp.date_of_joining || '',
            monthly_ctc: emp.monthly_ctc?.toString() || '',
            skillsInput: '',
          });
          setSkills(emp.skills || []);
        }
      };
      fetch();
    }
  }, [id, isEdit]);

  const handleSkillInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = form.skillsInput.trim().replace(/,/g, '');
      if (val && !skills.includes(val)) {
        setSkills([...skills, val]);
      }
      setForm({ ...form, skillsInput: '' });
    }
  };

  const removeSkill = (s: string) => setSkills(skills.filter(sk => sk !== s));

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.role || !form.department) {
      toast({ title: 'Missing fields', description: 'Name, email, role and department are required', variant: 'destructive' });
      return;
    }

    setSaving(true);
    const payload = {
      name: form.name,
      email: form.email,
      role: form.role,
      department: form.department,
      designation: form.designation,
      status: form.status,
      date_of_joining: form.date_of_joining || null,
      monthly_ctc: form.monthly_ctc ? parseFloat(form.monthly_ctc) : null,
      skills: skills,
    };

    let error: any;
    if (isEdit) {
      ({ error } = await db.from('employees').update(payload.eq('id', id));
    } else {
      ({ error } = await db.from('employees').insert(payload);
    }

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      setSaving(false);
      return;
    }

    // Audit log (best-effort, no table yet so this will silently fail)
    try {
      await db.from('audit_logs').insert({
        module: 'encrew',
        entity_type: 'employee',
        event_type: isEdit ? 'employee.updated' : 'employee.created',
        actor_id: currentEmp?.id || null,
        entity_id: id || null,
      };
    } catch {}

    toast({ title: isEdit ? 'Employee updated' : 'Employee created' });
    navigate(isEdit ? `/people/${id}` : '/people');
    setSaving(false);
  };

  return (
    <StaggerContainer className="space-y-6 max-w-2xl">
      <StaggerItem>
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="text-muted-foreground mb-2">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <h1 className="text-2xl font-bold text-foreground">{isEdit ? 'Edit Employee' : 'Add Employee'}</h1>
      </StaggerItem>

      <StaggerItem>
        <div className="glass-card p-6 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Name *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Email *</Label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
            <div><Label>Role *</Label><Input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} /></div>
            <div><Label>Department *</Label><Input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} /></div>
            <div><Label>Designation</Label><Input value={form.designation} onChange={e => setForm({ ...form, designation: e.target.value })} /></div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="onboarding">Onboarding</SelectItem>
                  <SelectItem value="on_leave">On Leave</SelectItem>
                  <SelectItem value="exited">Exited</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Date of Joining</Label><Input type="date" value={form.date_of_joining} onChange={e => setForm({ ...form, date_of_joining: e.target.value })} /></div>
            <div><Label>Monthly CTC</Label><Input type="number" value={form.monthly_ctc} onChange={e => setForm({ ...form, monthly_ctc: e.target.value })} /></div>
          </div>

          <div>
            <Label>Skills (type + Enter or comma to add)</Label>
            <Input
              value={form.skillsInput}
              onChange={e => setForm({ ...form, skillsInput: e.target.value })}
              onKeyDown={handleSkillInput}
              placeholder="Type a skill…"
            />
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {skills.map(s => (
                  <span key={s} className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium" style={{ background: 'hsl(var(--info-muted))', color: 'hsl(var(--info))' }}>
                    {s}
                    <button onClick={() => removeSkill(s)} className="hover:text-foreground"><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button onClick={handleSubmit} disabled={saving} className="btn-primary">
              <Save className="w-4 h-4" /> {saving ? 'Saving…' : isEdit ? 'Update' : 'Create'}
            </Button>
            <Button variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
          </div>
        </div>
      </StaggerItem>
    </StaggerContainer>
  );
};

export default AddEmployee;
