import React, { createContext, useContext, useState } from 'react';
import { Claim, LeaveWFHRequest, HRTicket, ClaimApproval, HandbookChunk, OnboardingCase, OnboardingTemplate, OnboardingTask, ExitCase, FullFinalSettlement, InsurancePolicy, EmployeeInsurance, PayrollRun, PayrollLineItem, Vendor, VendorService, InternalRateCard, AdminSettings } from '@/types/hr';
import {
  claims as initialClaims, leaveRequests as initialLeaves, tickets as initialTickets,
  claimApprovals as initialApprovals, handbookChunks as initialChunks,
  onboardingCases as initialObCases, onboardingTemplates as initialObTemplates,
  onboardingTasks as initialObTasks, exitCases as initialExitCases,
  fullFinalSettlements as initialFFSettlements, insurancePolicies as initialInsPolicies,
  employeeInsurance as initialEmpIns, payrollRuns as initialPayrollRuns,
  payrollLineItems as initialPayrollItems, vendors as initialVendors,
  vendorServices as initialVendorServices, internalRateCards as initialRateCards,
  defaultAdminSettings,
} from '@/data/mockData';

interface DataContextType {
  claims: Claim[];
  setClaims: React.Dispatch<React.SetStateAction<Claim[]>>;
  approvals: ClaimApproval[];
  setApprovals: React.Dispatch<React.SetStateAction<ClaimApproval[]>>;
  leaveRequests: LeaveWFHRequest[];
  setLeaveRequests: React.Dispatch<React.SetStateAction<LeaveWFHRequest[]>>;
  tickets: HRTicket[];
  setTickets: React.Dispatch<React.SetStateAction<HRTicket[]>>;
  handbook: HandbookChunk[];
  setHandbook: React.Dispatch<React.SetStateAction<HandbookChunk[]>>;
  searchHandbook: (query: string) => HandbookChunk[];
  onboardingCases: OnboardingCase[];
  setOnboardingCases: React.Dispatch<React.SetStateAction<OnboardingCase[]>>;
  onboardingTemplates: OnboardingTemplate[];
  setOnboardingTemplates: React.Dispatch<React.SetStateAction<OnboardingTemplate[]>>;
  onboardingTasks: OnboardingTask[];
  setOnboardingTasks: React.Dispatch<React.SetStateAction<OnboardingTask[]>>;
  exitCases: ExitCase[];
  setExitCases: React.Dispatch<React.SetStateAction<ExitCase[]>>;
  ffSettlements: FullFinalSettlement[];
  setFFSettlements: React.Dispatch<React.SetStateAction<FullFinalSettlement[]>>;
  insurancePolicies: InsurancePolicy[];
  setInsurancePolicies: React.Dispatch<React.SetStateAction<InsurancePolicy[]>>;
  employeeInsurance: EmployeeInsurance[];
  setEmployeeInsurance: React.Dispatch<React.SetStateAction<EmployeeInsurance[]>>;
  payrollRuns: PayrollRun[];
  setPayrollRuns: React.Dispatch<React.SetStateAction<PayrollRun[]>>;
  payrollLineItems: PayrollLineItem[];
  setPayrollLineItems: React.Dispatch<React.SetStateAction<PayrollLineItem[]>>;
  vendors: Vendor[];
  setVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
  vendorServices: VendorService[];
  setVendorServices: React.Dispatch<React.SetStateAction<VendorService[]>>;
  rateCards: InternalRateCard[];
  setRateCards: React.Dispatch<React.SetStateAction<InternalRateCard[]>>;
  adminSettings: AdminSettings;
  setAdminSettings: React.Dispatch<React.SetStateAction<AdminSettings>>;
}

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [claims, setClaims] = useState<Claim[]>(initialClaims);
  const [approvals, setApprovals] = useState<ClaimApproval[]>(initialApprovals);
  const [leaveRequests, setLeaveRequests] = useState<LeaveWFHRequest[]>(initialLeaves);
  const [tickets, setTickets] = useState<HRTicket[]>(initialTickets);
  const [handbook, setHandbook] = useState<HandbookChunk[]>(initialChunks);
  const [onboardingCases, setOnboardingCases] = useState<OnboardingCase[]>(initialObCases);
  const [onboardingTemplates, setOnboardingTemplates] = useState<OnboardingTemplate[]>(initialObTemplates);
  const [onboardingTasks, setOnboardingTasks] = useState<OnboardingTask[]>(initialObTasks);
  const [exitCases, setExitCases] = useState<ExitCase[]>(initialExitCases);
  const [ffSettlements, setFFSettlements] = useState<FullFinalSettlement[]>(initialFFSettlements);
  const [insurancePolicies, setInsurancePolicies] = useState<InsurancePolicy[]>(initialInsPolicies);
  const [employeeInsurance, setEmployeeInsurance] = useState<EmployeeInsurance[]>(initialEmpIns);
  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>(initialPayrollRuns);
  const [payrollLineItems, setPayrollLineItems] = useState<PayrollLineItem[]>(initialPayrollItems);
  const [vendorsState, setVendors] = useState<Vendor[]>(initialVendors);
  const [vendorServicesState, setVendorServices] = useState<VendorService[]>(initialVendorServices);
  const [rateCards, setRateCards] = useState<InternalRateCard[]>(initialRateCards);
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(defaultAdminSettings);

  const searchHandbook = (query: string): HandbookChunk[] => {
    const terms = query.toLowerCase().split(/\s+/);
    return handbook
      .filter(chunk => {
        const text = `${chunk.section} ${chunk.chunk_text} ${chunk.tags.join(' ')}`.toLowerCase();
        return terms.some(t => text.includes(t));
      })
      .slice(0, 5);
  };

  return (
    <DataContext.Provider value={{
      claims, setClaims, approvals, setApprovals, leaveRequests, setLeaveRequests,
      tickets, setTickets, handbook, setHandbook, searchHandbook,
      onboardingCases, setOnboardingCases, onboardingTemplates, setOnboardingTemplates,
      onboardingTasks, setOnboardingTasks, exitCases, setExitCases,
      ffSettlements, setFFSettlements, insurancePolicies, setInsurancePolicies,
      employeeInsurance, setEmployeeInsurance, payrollRuns, setPayrollRuns,
      payrollLineItems, setPayrollLineItems, vendors: vendorsState, setVendors,
      vendorServices: vendorServicesState, setVendorServices,
      rateCards, setRateCards, adminSettings, setAdminSettings,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be inside DataProvider');
  return ctx;
};
