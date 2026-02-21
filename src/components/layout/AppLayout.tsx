import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarProvider, SidebarTrigger,
} from '@/components/ui/sidebar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  LayoutDashboard, Receipt, FilePlus, Calendar, MessageCircleQuestion,
  Ticket, CheckSquare, DollarSign,
} from 'lucide-react';

export const AppLayout = () => {
  const { currentUser, setCurrentUser, allEmployees } = useAuth();
  const location = useLocation();

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/claims/submit', icon: FilePlus, label: 'Submit Claim' },
    { to: '/claims', icon: Receipt, label: 'My Claims' },
    { to: '/leave-wfh', icon: Calendar, label: 'Leave & WFH' },
    { to: '/ask-hr', icon: MessageCircleQuestion, label: 'Ask HR' },
    { to: '/tickets', icon: Ticket, label: 'HR Tickets' },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader className="p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-bold text-sm">E</div>
              <div>
                <h1 className="font-bold text-sidebar-accent-foreground text-sm">Enfactum HR Hub</h1>
                <p className="text-xs text-sidebar-foreground">Internal Portal</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map(item => (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton asChild isActive={location.pathname === item.to}>
                        <NavLink to={item.to}>
                          <item.icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {currentUser.is_manager && (
              <SidebarGroup>
                <SidebarGroupLabel>Manager</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={location.pathname === '/approvals'}>
                        <NavLink to="/approvals">
                          <CheckSquare className="w-4 h-4" />
                          <span>Approvals</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}

            {currentUser.is_finance && (
              <SidebarGroup>
                <SidebarGroupLabel>Finance</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={location.pathname === '/finance'}>
                        <NavLink to="/finance">
                          <DollarSign className="w-4 h-4" />
                          <span>Finance Console</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
          </SidebarContent>

          <SidebarFooter className="p-4 border-t border-sidebar-border">
            <div className="space-y-2">
              <p className="text-xs text-sidebar-foreground">Signed in as</p>
              <Select value={currentUser.id} onValueChange={(val) => {
                const emp = allEmployees.find(e => e.id === val);
                if (emp) setCurrentUser(emp);
              }}>
                <SelectTrigger className="bg-sidebar-accent border-sidebar-border text-sidebar-accent-foreground text-xs h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {allEmployees.map(emp => (
                    <SelectItem key={emp.id} value={emp.id} className="text-xs">
                      {emp.full_name} {emp.is_manager ? '(Mgr)' : emp.is_finance ? '(Fin)' : emp.is_hr_admin ? '(HR)' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-sidebar-foreground">{currentUser.role_title} · {currentUser.department}</p>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 overflow-auto">
          <div className="flex items-center gap-2 p-4 border-b border-border bg-card">
            <SidebarTrigger />
            <span className="text-sm font-semibold text-foreground">Enfactum HR Hub</span>
          </div>
          <div className="p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};
