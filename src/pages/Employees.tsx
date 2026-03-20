import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { employees } from '@/data/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, UserPlus, UserMinus, Search } from 'lucide-react';
import { StaggerContainer, StaggerItem } from '@/components/motion/MotionPrimitives';
import { Employee, Country } from '@/types/hr';

const Employees = () => {
  const { currentUser } = useAuth();
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [managerFilter, setManagerFilter] = useState<string>('all');

  const managers = employees.filter(e => e.is_manager);

  const filterEmployees = (list: Employee[]) => {
    return list.filter(e => {
      const matchesSearch = !search || e.full_name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase()) || e.department.toLowerCase().includes(search.toLowerCase());
      const matchesCountry = countryFilter === 'all' || e.country === countryFilter;
      const matchesManager = managerFilter === 'all' || e.manager_id === managerFilter;
      return matchesSearch && matchesCountry && matchesManager;
    });
  };

  const newHires = filterEmployees(employees.filter(e => e.lifecycle_status === 'new_hire'));
  const active = filterEmployees(employees.filter(e => e.lifecycle_status === 'active'));
  const exitEmployees = filterEmployees(employees.filter(e => e.lifecycle_status === 'exit_initiated' || e.lifecycle_status === 'exited'));

  const getManagerName = (id: string | null) => {
    if (!id) return '—';
    return employees.find(e => e.id === id)?.full_name || '—';
  };

  const renderTable = (list: Employee[]) => (
    <div className="glass-card overflow-hidden mt-4">
      {list.length === 0 ? (
        <div className="p-6 text-center text-muted-foreground text-sm">No employees found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Department</th>
                <th>Country</th>
                <th>Manager</th>
                <th>Type</th>
                <th>Start Date</th>
              </tr>
            </thead>
            <tbody>
              {list.map(emp => (
                <tr key={emp.id}>
                  <td>
                    <div>
                      <p className="font-medium text-foreground">{emp.full_name}</p>
                      <p className="text-xs text-muted-foreground">{emp.email}</p>
                    </div>
                  </td>
                  <td className="text-foreground">{emp.role_title}</td>
                  <td className="text-muted-foreground">{emp.department}</td>
                  <td>
                    <span className="text-xs rounded-full px-2 py-0.5" style={{ background: 'hsl(var(--surface-4))', color: 'hsl(var(--foreground))' }}>
                      {emp.country}
                    </span>
                  </td>
                  <td className="text-muted-foreground">{getManagerName(emp.manager_id)}</td>
                  <td className="text-xs text-muted-foreground capitalize">{emp.employment_type.replace('_', ' ')}</td>
                  <td className="text-muted-foreground text-xs">{new Date(emp.start_date).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <StaggerContainer className="space-y-6">
      <StaggerItem>
        <h1 className="text-2xl font-bold text-foreground">Employees</h1>
        <p className="text-sm text-muted-foreground">Manage employee lifecycle across all regions</p>
      </StaggerItem>

      {/* KPIs */}
      <StaggerItem>
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: UserPlus, label: 'New Hires', count: employees.filter(e => e.lifecycle_status === 'new_hire').length, color: 'info' },
            { icon: Users, label: 'Active', count: employees.filter(e => e.lifecycle_status === 'active').length, color: 'positive' },
            { icon: UserMinus, label: 'Exit', count: employees.filter(e => e.lifecycle_status === 'exit_initiated' || e.lifecycle_status === 'exited').length, color: 'warning' },
          ].map(kpi => (
            <div key={kpi.label} className="kpi-card">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `hsl(var(--${kpi.color}-muted))` }}>
                  <kpi.icon className="w-3.5 h-3.5" style={{ color: `hsl(var(--${kpi.color}))` }} />
                </div>
                <span className="text-xs text-muted-foreground">{kpi.label}</span>
              </div>
              <p className="text-xl font-bold mono text-foreground">{kpi.count}</p>
            </div>
          ))}
        </div>
      </StaggerItem>

      {/* Filters */}
      <StaggerItem>
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by name, email, or department..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Country" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              <SelectItem value="Singapore">Singapore</SelectItem>
              <SelectItem value="India">India</SelectItem>
              <SelectItem value="Malaysia">Malaysia</SelectItem>
            </SelectContent>
          </Select>
          <Select value={managerFilter} onValueChange={setManagerFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Manager" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Managers</SelectItem>
              {managers.map(m => <SelectItem key={m.id} value={m.id}>{m.full_name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </StaggerItem>

      {/* Tabs */}
      <StaggerItem>
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="new_hire">New Hire ({newHires.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({active.length})</TabsTrigger>
            <TabsTrigger value="exit">Exit ({exitEmployees.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="new_hire">{renderTable(newHires)}</TabsContent>
          <TabsContent value="active">{renderTable(active)}</TabsContent>
          <TabsContent value="exit">{renderTable(exitEmployees)}</TabsContent>
        </Tabs>
      </StaggerItem>
    </StaggerContainer>
  );
};

export default Employees;
