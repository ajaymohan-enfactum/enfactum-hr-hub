import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import SubmitClaim from "@/pages/SubmitClaim";
import MyClaims from "@/pages/MyClaims";
import ManagerApprovals from "@/pages/ManagerApprovals";
import FinanceConsole from "@/pages/FinanceConsole";
import LeaveWFH from "@/pages/LeaveWFH";
import AskHR from "@/pages/AskHR";
import HRTickets from "@/pages/HRTickets";
import ClaimDetail from "@/pages/ClaimDetail";
import HandbookManager from "@/pages/HandbookManager";
import Employees from "@/pages/Employees";
import Onboarding from "@/pages/Onboarding";
import ExitManagement from "@/pages/ExitManagement";
import Insurance from "@/pages/Insurance";
import Payroll from "@/pages/Payroll";
import Operations from "@/pages/Operations";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/claims/submit" element={<SubmitClaim />} />
                <Route path="/claims" element={<MyClaims />} />
                <Route path="/claims/:id" element={<ClaimDetail />} />
                <Route path="/approvals" element={<ManagerApprovals />} />
                <Route path="/finance" element={<FinanceConsole />} />
                <Route path="/leave-wfh" element={<LeaveWFH />} />
                <Route path="/ask-hr" element={<AskHR />} />
                <Route path="/tickets" element={<HRTickets />} />
                <Route path="/handbook" element={<HandbookManager />} />
                <Route path="/employees" element={<Employees />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/exit" element={<ExitManagement />} />
                <Route path="/insurance" element={<Insurance />} />
                <Route path="/payroll" element={<Payroll />} />
                <Route path="/operations" element={<Operations />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </DataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
