import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { employees } from '@/data/mockData';
import { StatusBadge } from '@/components/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ClipboardList, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { StaggerContainer, StaggerItem } from '@/components/motion/MotionPrimitives';
import { OnboardingTask } from '@/types/hr';

const ownerRoleColors: Record<string, string> = {
  HR: 'hsl(280, 70%, 62%)',
  Manager: 'hsl(38, 95%, 56%)',
  IT: 'hsl(210, 100%, 58%)',
  Finance: 'hsl(155, 60%, 46%)',
  Employee: 'hsl(180, 60%, 46%)',
};

const Onboarding = () => {
  const { currentUser } = useAuth();
  const { onboardingCases, onboardingTasks, setOnboardingTasks, onboardingTemplates } = useData();
  const { toast } = useToast();

  const getEmployeeName = (id: string) => employees.find(e => e.id === id)?.full_name || 'Unknown';

  const activeCases = onboardingCases.filter(c => c.status !== 'complete');
  const completedCases = onboardingCases.filter(c => c.status === 'complete');

  // Tasks assigned to current user or their role
  const myTasks = onboardingTasks.filter(t =>
    t.owner_employee_id === currentUser.id ||
    (currentUser.is_manager && t.owner_role === 'Manager') ||
    (currentUser.is_hr_admin && t.owner_role === 'HR') ||
    (currentUser.is_finance && t.owner_role === 'Finance')
  );

  const overdueTasks = onboardingTasks.filter(t => t.status !== 'done' && new Date(t.due_date) < new Date());

  const handleTaskStatusChange = (taskId: string, newStatus: OnboardingTask['status']) => {
    setOnboardingTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    toast({ title: 'Task updated', description: `Task marked as ${newStatus}` });
  };

  const renderTaskCard = (task: OnboardingTask) => {
    const caseDef = onboardingCases.find(c => c.id === task.onboarding_case_id);
    const isOverdue = task.status !== 'done' && new Date(task.due_date) < new Date();
    return (
      <div key={task.id} className="glass-card p-4 space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="font-medium text-foreground">{task.task_name}</p>
            {caseDef && <p className="text-xs text-muted-foreground">For: {getEmployeeName(caseDef.employee_id)} · {caseDef.role}</p>}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs rounded-full px-2 py-0.5" style={{ background: `${ownerRoleColors[task.owner_role]}22`, color: ownerRoleColors[task.owner_role] }}>
                {task.owner_role}
              </span>
              {task.owner_employee_id && (
                <span className="text-xs text-muted-foreground">→ {getEmployeeName(task.owner_employee_id)}</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Due: {new Date(task.due_date).toLocaleDateString('en-SG', { day: 'numeric', month: 'short' })}
              {isOverdue && <span className="ml-1" style={{ color: 'hsl(var(--negative))' }}>⚠ Overdue</span>}
            </p>
            {task.notes && <p className="text-xs text-muted-foreground italic mt-1">{task.notes}</p>}
          </div>
          <StatusBadge status={task.status === 'todo' ? 'open' : task.status === 'doing' ? 'in_progress' : 'resolved'} />
        </div>
        <div className="flex gap-2">
          {task.status !== 'done' && (
            <>
              {task.status === 'todo' && (
                <button className="btn-glass text-xs" onClick={() => handleTaskStatusChange(task.id, 'doing')}>
                  <Clock className="w-3.5 h-3.5" /> Start
                </button>
              )}
              <button className="btn-primary text-xs" onClick={() => handleTaskStatusChange(task.id, 'done')}>
                <CheckCircle className="w-3.5 h-3.5" /> Complete
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <StaggerContainer className="space-y-6">
      <StaggerItem>
        <h1 className="text-2xl font-bold text-foreground">Onboarding</h1>
        <p className="text-sm text-muted-foreground">Manage new hire onboarding cases and tasks</p>
      </StaggerItem>

      {/* KPIs */}
      <StaggerItem>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: ClipboardList, label: 'Active Cases', value: activeCases.length, color: 'primary' },
            { icon: CheckCircle, label: 'Completed', value: completedCases.length, color: 'positive' },
            { icon: Clock, label: 'My Tasks', value: myTasks.filter(t => t.status !== 'done').length, color: 'warning' },
            { icon: AlertTriangle, label: 'Overdue', value: overdueTasks.length, color: 'negative' },
          ].map(kpi => (
            <div key={kpi.label} className="kpi-card">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `hsl(var(--${kpi.color}-muted))` }}>
                  <kpi.icon className="w-3.5 h-3.5" style={{ color: `hsl(var(--${kpi.color}))` }} />
                </div>
                <span className="text-xs text-muted-foreground">{kpi.label}</span>
              </div>
              <p className="text-xl font-bold mono text-foreground">{kpi.value}</p>
            </div>
          ))}
        </div>
      </StaggerItem>

      <StaggerItem>
        <Tabs defaultValue="cases">
          <TabsList>
            <TabsTrigger value="cases">Active Cases ({activeCases.length})</TabsTrigger>
            <TabsTrigger value="my_tasks">My Tasks ({myTasks.filter(t => t.status !== 'done').length})</TabsTrigger>
            {currentUser.is_hr_admin && <TabsTrigger value="templates">Templates ({onboardingTemplates.length})</TabsTrigger>}
          </TabsList>

          <TabsContent value="cases" className="space-y-3 mt-4">
            {activeCases.length === 0 ? (
              <div className="glass-card p-6 text-center text-muted-foreground">No active onboarding cases.</div>
            ) : activeCases.map(cas => {
              const emp = employees.find(e => e.id === cas.employee_id);
              const tasks = onboardingTasks.filter(t => t.onboarding_case_id === cas.id);
              const done = tasks.filter(t => t.status === 'done').length;
              return (
                <div key={cas.id} className="glass-card p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-foreground">{emp?.full_name || 'Unknown'}</p>
                      <p className="text-sm text-muted-foreground">{cas.role} · {cas.country} · Start: {new Date(cas.start_date).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      <p className="text-xs text-muted-foreground">Manager: {getEmployeeName(cas.manager_id)}</p>
                    </div>
                    <StatusBadge status={cas.status === 'not_started' ? 'open' : cas.status === 'in_progress' ? 'in_progress' : 'resolved'} />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full" style={{ background: 'hsl(var(--surface-4))' }}>
                      <div className="h-full rounded-full" style={{ width: `${tasks.length > 0 ? (done / tasks.length * 100) : 0}%`, background: 'var(--gradient-accent)' }} />
                    </div>
                    <span className="text-xs mono text-muted-foreground">{done}/{tasks.length}</span>
                  </div>
                  <div className="space-y-2">
                    {tasks.map(renderTaskCard)}
                  </div>
                </div>
              );
            })}
          </TabsContent>

          <TabsContent value="my_tasks" className="space-y-3 mt-4">
            {myTasks.filter(t => t.status !== 'done').length === 0 ? (
              <div className="glass-card p-6 text-center text-muted-foreground">All your tasks are complete! 🎉</div>
            ) : myTasks.filter(t => t.status !== 'done').map(renderTaskCard)}
          </TabsContent>

          {currentUser.is_hr_admin && (
            <TabsContent value="templates" className="mt-4">
              <div className="glass-card overflow-hidden">
                <table className="w-full data-table">
                  <thead>
                    <tr><th>Template</th><th>Country</th><th>Role Family</th><th>Default</th></tr>
                  </thead>
                  <tbody>
                    {onboardingTemplates.map(t => (
                      <tr key={t.id}>
                        <td className="font-medium text-foreground">{t.template_name}</td>
                        <td className="text-muted-foreground">{t.country}</td>
                        <td className="text-muted-foreground">{t.role_family}</td>
                        <td>{t.is_default ? <span style={{ color: 'hsl(var(--positive))' }}>✓</span> : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </StaggerItem>
    </StaggerContainer>
  );
};

export default Onboarding;
