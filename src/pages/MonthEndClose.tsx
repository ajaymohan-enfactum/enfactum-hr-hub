import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { employees } from '@/data/mockData';
import { StatusBadge } from '@/components/StatusBadge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { StaggerContainer, StaggerItem } from '@/components/motion/MotionPrimitives';
import { CalendarCheck, CheckCircle, Download, Clock } from 'lucide-react';

const MonthEndClose = () => {
  const { monthEndCloses, monthEndCloseTasks, setMonthEndCloseTasks } = useData();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [countryFilter, setCountryFilter] = useState('all');

  const filtered = monthEndCloses.filter(m => countryFilter === 'all' || m.country === countryFilter);
  const getOwner = (id: string) => employees.find(e => e.id === id)?.full_name || '—';

  const handleTaskDone = (taskId: string) => {
    setMonthEndCloseTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'done' as const } : t));
    toast({ title: 'Task completed' });
  };

  const handleExport = (closeMonth: string) => {
    toast({ title: 'Export started', description: `Generating month-end pack for ${closeMonth}. CSV downloads will begin shortly.` });
  };

  return (
    <StaggerContainer className="space-y-6">
      <StaggerItem>
        <h1 className="text-2xl font-bold text-foreground">Month-End Close</h1>
        <p className="text-sm text-muted-foreground">Track and complete monthly closing workflows</p>
      </StaggerItem>

      <StaggerItem>
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Clock, label: 'In Progress', value: monthEndCloses.filter(m => m.status === 'in_progress').length, color: 'warning' },
            { icon: CalendarCheck, label: 'Ready', value: monthEndCloses.filter(m => m.status === 'ready_for_submit' || m.status === 'submitted').length, color: 'info' },
            { icon: CheckCircle, label: 'Closed', value: monthEndCloses.filter(m => m.status === 'closed').length, color: 'positive' },
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
        <Select value={countryFilter} onValueChange={setCountryFilter}>
          <SelectTrigger className="w-[150px]"><SelectValue placeholder="Country" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            <SelectItem value="Singapore">Singapore</SelectItem>
            <SelectItem value="India">India</SelectItem>
            <SelectItem value="Malaysia">Malaysia</SelectItem>
          </SelectContent>
        </Select>
      </StaggerItem>

      <StaggerItem>
        <div className="space-y-4">
          {filtered.map(mec => {
            const tasks = monthEndCloseTasks.filter(t => t.month_end_close_id === mec.id);
            const doneCount = tasks.filter(t => t.status === 'done').length;
            return (
              <div key={mec.id} className="glass-card p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-foreground">{mec.country} — {mec.close_month}</p>
                    <p className="text-xs text-muted-foreground">Owner: {getOwner(mec.owner_id)}</p>
                    {mec.notes && <p className="text-xs text-muted-foreground italic">{mec.notes}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={mec.status === 'closed' ? 'closed' : mec.status === 'in_progress' ? 'in_progress' : mec.status === 'not_started' ? 'open' : 'submitted'} />
                    <button className="btn-glass text-xs" onClick={() => handleExport(mec.close_month)}>
                      <Download className="w-3.5 h-3.5" /> Export Pack
                    </button>
                  </div>
                </div>

                {tasks.length > 0 && (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full" style={{ background: 'hsl(var(--surface-4))' }}>
                        <div className="h-full rounded-full" style={{ width: `${tasks.length ? (doneCount / tasks.length * 100) : 0}%`, background: 'var(--gradient-accent)' }} />
                      </div>
                      <span className="text-xs mono text-muted-foreground">{doneCount}/{tasks.length}</span>
                    </div>
                    <div className="space-y-2">
                      {tasks.map(task => (
                        <div key={task.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'hsl(var(--surface-3))' }}>
                          <div className="flex-1">
                            <p className="text-sm text-foreground">{task.task_name}</p>
                            <p className="text-xs text-muted-foreground">{task.owner_role}{task.owner_employee_id ? ` → ${getOwner(task.owner_employee_id)}` : ''} · Due: {new Date(task.due_date).toLocaleDateString('en-SG', { day: 'numeric', month: 'short' })}</p>
                            {task.notes && <p className="text-xs text-muted-foreground italic">{task.notes}</p>}
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusBadge status={task.status === 'done' ? 'resolved' : task.status === 'doing' ? 'in_progress' : 'open'} />
                            {task.status !== 'done' && (
                              <button className="btn-primary text-xs py-1" onClick={() => handleTaskDone(task.id)}>
                                <CheckCircle className="w-3 h-3" /> Done
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </StaggerItem>
    </StaggerContainer>
  );
};

export default MonthEndClose;
