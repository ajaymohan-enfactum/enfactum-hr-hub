import React, { createContext, useContext, useState } from 'react';
import { Claim, LeaveWFHRequest, HRTicket, ClaimApproval, HandbookChunk } from '@/types/hr';
import { claims as initialClaims, leaveRequests as initialLeaves, tickets as initialTickets, claimApprovals as initialApprovals, handbookChunks } from '@/data/mockData';

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
  searchHandbook: (query: string) => HandbookChunk[];
}

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [claims, setClaims] = useState<Claim[]>(initialClaims);
  const [approvals, setApprovals] = useState<ClaimApproval[]>(initialApprovals);
  const [leaveRequests, setLeaveRequests] = useState<LeaveWFHRequest[]>(initialLeaves);
  const [tickets, setTickets] = useState<HRTicket[]>(initialTickets);

  const searchHandbook = (query: string): HandbookChunk[] => {
    const terms = query.toLowerCase().split(/\s+/);
    return handbookChunks
      .filter(chunk => {
        const text = `${chunk.section} ${chunk.chunk_text} ${chunk.tags.join(' ')}`.toLowerCase();
        return terms.some(t => text.includes(t));
      })
      .slice(0, 5);
  };

  return (
    <DataContext.Provider value={{ claims, setClaims, approvals, setApprovals, leaveRequests, setLeaveRequests, tickets, setTickets, handbook: handbookChunks, searchHandbook }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be inside DataProvider');
  return ctx;
};
