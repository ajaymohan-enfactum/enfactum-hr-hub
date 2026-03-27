import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { EncrewLayout } from "@/components/layout/EncrewLayout";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import Login from "@/pages/Login";
import Dashboard from "@/pages/encrew/Dashboard";
import PeopleList from "@/pages/encrew/PeopleList";
import EmployeeProfile from "@/pages/encrew/EmployeeProfile";
import AddEmployee from "@/pages/encrew/AddEmployee";
import SkillsMatrix from "@/pages/encrew/SkillsMatrix";
import Utilization from "@/pages/encrew/Utilization";
import Certifications from "@/pages/encrew/Certifications";
import EncrewSettings from "@/pages/encrew/EncrewSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute><EncrewLayout /></ProtectedRoute>}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/people" element={<PeopleList />} />
              <Route path="/people/new" element={<AddEmployee />} />
              <Route path="/people/:id" element={<EmployeeProfile />} />
              <Route path="/people/:id/edit" element={<AddEmployee />} />
              <Route path="/skills" element={<SkillsMatrix />} />
              <Route path="/utilization" element={<Utilization />} />
              <Route path="/certifications" element={<Certifications />} />
              <Route path="/settings" element={<EncrewSettings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
