import { Employee, Claim, ClaimApproval, LeaveWFHRequest, HRTicket, HandbookChunk, OnboardingCase, OnboardingTemplate, OnboardingTask, ExitCase, FullFinalSettlement, InsurancePolicy, EmployeeInsurance, PayrollRun, PayrollLineItem, Vendor, VendorService, InternalRateCard, AdminSettings } from '@/types/hr';

export const employees: Employee[] = [
  { id: 'emp-1', full_name: 'Alice Chen', email: 'alice@enfactum.com', role_title: 'Software Engineer', department: 'Engineering', location: 'Singapore', manager_id: 'emp-6', employment_status: 'active', start_date: '2023-03-15', is_manager: false, is_finance: false, is_hr_admin: false, lifecycle_status: 'active', country: 'Singapore', employment_type: 'full_time' },
  { id: 'emp-2', full_name: 'Bob Kumar', email: 'bob@enfactum.com', role_title: 'Product Designer', department: 'Engineering', location: 'Singapore', manager_id: 'emp-6', employment_status: 'active', start_date: '2023-06-01', is_manager: false, is_finance: false, is_hr_admin: false, lifecycle_status: 'active', country: 'Singapore', employment_type: 'full_time' },
  { id: 'emp-3', full_name: 'Carol Tan', email: 'carol@enfactum.com', role_title: 'Marketing Executive', department: 'Marketing', location: 'Singapore', manager_id: 'emp-7', employment_status: 'active', start_date: '2022-11-10', is_manager: false, is_finance: false, is_hr_admin: false, lifecycle_status: 'active', country: 'Singapore', employment_type: 'full_time' },
  { id: 'emp-4', full_name: 'David Lee', email: 'david@enfactum.com', role_title: 'Sales Representative', department: 'Sales', location: 'Singapore', manager_id: 'emp-7', employment_status: 'active', start_date: '2024-01-08', is_manager: false, is_finance: false, is_hr_admin: false, lifecycle_status: 'active', country: 'Singapore', employment_type: 'full_time' },
  { id: 'emp-5', full_name: 'Eve Wong', email: 'eve@enfactum.com', role_title: 'Operations Coordinator', department: 'Operations', location: 'Singapore', manager_id: 'emp-7', employment_status: 'active', start_date: '2023-09-20', is_manager: false, is_finance: false, is_hr_admin: false, lifecycle_status: 'exit_initiated', country: 'Singapore', employment_type: 'full_time' },
  { id: 'emp-6', full_name: 'Frank Lim', email: 'frank@enfactum.com', role_title: 'Engineering Manager', department: 'Engineering', location: 'Singapore', manager_id: null, employment_status: 'active', start_date: '2021-05-01', is_manager: true, is_finance: false, is_hr_admin: false, lifecycle_status: 'active', country: 'Singapore', employment_type: 'full_time' },
  { id: 'emp-7', full_name: 'Grace Ng', email: 'grace@enfactum.com', role_title: 'Head of Business', department: 'Business', location: 'Singapore', manager_id: null, employment_status: 'active', start_date: '2020-08-15', is_manager: true, is_finance: false, is_hr_admin: false, lifecycle_status: 'active', country: 'Singapore', employment_type: 'full_time' },
  { id: 'emp-8', full_name: 'Henry Ong', email: 'henry@enfactum.com', role_title: 'Finance Analyst', department: 'Finance', location: 'Singapore', manager_id: null, employment_status: 'active', start_date: '2022-02-01', is_manager: false, is_finance: true, is_hr_admin: false, lifecycle_status: 'active', country: 'Singapore', employment_type: 'full_time' },
  { id: 'emp-9', full_name: 'Irene Patel', email: 'irene@enfactum.com', role_title: 'HR Manager', department: 'People & Culture', location: 'Singapore', manager_id: null, employment_status: 'active', start_date: '2021-01-15', is_manager: false, is_finance: false, is_hr_admin: true, lifecycle_status: 'active', country: 'Singapore', employment_type: 'full_time' },
  { id: 'emp-10', full_name: 'James Ho', email: 'james@enfactum.com', role_title: 'Junior Developer', department: 'Engineering', location: 'Singapore', manager_id: 'emp-6', employment_status: 'active', start_date: '2024-07-01', is_manager: false, is_finance: false, is_hr_admin: false, lifecycle_status: 'new_hire', country: 'Singapore', employment_type: 'full_time' },
  { id: 'emp-11', full_name: 'Priya Sharma', email: 'priya@enfactum.com', role_title: 'Data Analyst', department: 'Engineering', location: 'India', manager_id: 'emp-6', employment_status: 'active', start_date: '2026-04-01', is_manager: false, is_finance: false, is_hr_admin: false, lifecycle_status: 'new_hire', country: 'India', employment_type: 'full_time' },
  { id: 'emp-12', full_name: 'Ahmad Rizal', email: 'ahmad@enfactum.com', role_title: 'QA Engineer', department: 'Engineering', location: 'Malaysia', manager_id: 'emp-6', employment_status: 'inactive', start_date: '2022-03-01', is_manager: false, is_finance: false, is_hr_admin: false, lifecycle_status: 'exited', country: 'Malaysia', employment_type: 'contract' },
];

export const claims: Claim[] = [
  { id: 'CLM-001', claimant_id: 'emp-1', category: 'business_travel', amount: 450, currency: 'SGD', expense_date: '2026-02-01', business_purpose: 'Client visit to Jakarta office', payment_method: 'personal_card', receipt_required: true, receipt_files: ['receipt_001.pdf'], status: 'submitted', submitted_at: '2026-02-03T09:00:00Z', updated_at: '2026-02-03T09:00:00Z', is_reimbursement: false, payout_mode: 'payroll' },
  { id: 'CLM-002', claimant_id: 'emp-1', category: 'meals_travel', amount: 85, currency: 'SGD', expense_date: '2026-02-02', business_purpose: 'Lunch during Jakarta trip', attendees: 'Alice Chen, Client PM', payment_method: 'personal_cash', receipt_required: true, receipt_files: ['receipt_002.jpg'], status: 'manager_approved', submitted_at: '2026-02-03T10:00:00Z', updated_at: '2026-02-05T14:00:00Z', is_reimbursement: false, payout_mode: 'payroll' },
  { id: 'CLM-003', claimant_id: 'emp-2', category: 'professional_development', amount: 200, currency: 'SGD', expense_date: '2026-01-15', business_purpose: 'UX Conference ticket', payment_method: 'personal_card', receipt_required: true, receipt_files: ['receipt_003.pdf'], status: 'paid', submitted_at: '2026-01-16T08:00:00Z', updated_at: '2026-02-07T12:00:00Z', is_reimbursement: false, payout_mode: 'payroll' },
  { id: 'CLM-004', claimant_id: 'emp-3', category: 'client_meeting_meals', amount: 320, currency: 'SGD', expense_date: '2026-02-10', business_purpose: 'Client dinner with Acme Corp team', payment_method: 'personal_card', receipt_required: true, receipt_files: ['receipt_004.pdf'], status: 'needs_info', submitted_at: '2026-02-11T11:00:00Z', updated_at: '2026-02-12T09:00:00Z', is_reimbursement: false, payout_mode: 'payroll' },
  { id: 'CLM-005', claimant_id: 'emp-4', category: 'ground_transport', amount: 45, currency: 'SGD', expense_date: '2026-02-14', business_purpose: 'Grab to client office', payment_method: 'personal_cash', receipt_required: true, receipt_files: ['receipt_005.png'], status: 'submitted', submitted_at: '2026-02-14T18:00:00Z', updated_at: '2026-02-14T18:00:00Z', is_reimbursement: false, payout_mode: 'payroll' },
  { id: 'CLM-006', claimant_id: 'emp-5', category: 'home_office_supplies', amount: 150, currency: 'SGD', expense_date: '2026-01-28', business_purpose: 'Monitor stand and keyboard', payment_method: 'personal_card', receipt_required: true, receipt_files: ['receipt_006.pdf'], status: 'finance_validated', submitted_at: '2026-01-29T10:00:00Z', updated_at: '2026-02-08T16:00:00Z', is_reimbursement: false, payout_mode: 'payroll' },
  { id: 'CLM-007', claimant_id: 'emp-10', category: 'phone_internet', amount: 60, currency: 'SGD', expense_date: '2026-02-01', business_purpose: 'Monthly mobile plan', payment_method: 'personal_cash', receipt_required: true, receipt_files: [], status: 'draft', submitted_at: '2026-02-15T10:00:00Z', updated_at: '2026-02-15T10:00:00Z', is_reimbursement: false, payout_mode: 'payroll' },
  { id: 'CLM-008', claimant_id: 'emp-1', category: 'client_entertainment', amount: 500, currency: 'SGD', expense_date: '2025-12-20', business_purpose: 'Year-end client appreciation dinner', attendees: 'Alice, Client CTO, Client PM', payment_method: 'personal_card', receipt_required: true, receipt_files: ['receipt_008.pdf'], status: 'rejected', submitted_at: '2026-01-25T09:00:00Z', updated_at: '2026-01-27T11:00:00Z', is_reimbursement: false, payout_mode: 'payroll' },
  { id: 'CLM-009', claimant_id: 'emp-1', category: 'reimbursement', amount: 120, currency: 'SGD', expense_date: '2026-03-01', business_purpose: 'Monthly mobile plan reimbursement', payment_method: 'personal_cash', receipt_required: true, receipt_files: ['receipt_009.pdf'], status: 'submitted', submitted_at: '2026-03-02T09:00:00Z', updated_at: '2026-03-02T09:00:00Z', is_reimbursement: true, reimbursement_type: 'mobile_internet_reimb', reimbursement_description: 'Monthly Singtel mobile plan for work use', payout_mode: 'payroll' },
];

export const claimApprovals: ClaimApproval[] = [
  { id: 'apr-1', claim_id: 'CLM-002', approver_id: 'emp-6', decision: 'approve', comment: 'Approved. Valid business expense.', decided_at: '2026-02-05T14:00:00Z' },
  { id: 'apr-2', claim_id: 'CLM-003', approver_id: 'emp-6', decision: 'approve', comment: 'Good for professional development.', decided_at: '2026-01-17T10:00:00Z' },
  { id: 'apr-3', claim_id: 'CLM-004', approver_id: 'emp-7', decision: 'needs_info', comment: 'Please add attendee names for the dinner.', decided_at: '2026-02-12T09:00:00Z' },
  { id: 'apr-4', claim_id: 'CLM-006', approver_id: 'emp-7', decision: 'approve', comment: 'Approved for home office setup.', decided_at: '2026-02-01T11:00:00Z' },
  { id: 'apr-5', claim_id: 'CLM-008', approver_id: 'emp-6', decision: 'reject', comment: 'Submitted more than 30 days after expense. Please resubmit with explanation.', decided_at: '2026-01-27T11:00:00Z' },
];

export const leaveRequests: LeaveWFHRequest[] = [
  { id: 'LV-001', requester_id: 'emp-1', request_type: 'WFH', start_date: '2026-02-24', end_date: '2026-02-24', reason: 'Waiting for plumber at home', status: 'manager_approved', submitted_at: '2026-02-20T09:00:00Z', updated_at: '2026-02-20T15:00:00Z' },
  { id: 'LV-002', requester_id: 'emp-2', request_type: 'WFH', start_date: '2026-02-26', end_date: '2026-02-26', reason: 'Deep focus work on design system', status: 'submitted', submitted_at: '2026-02-21T08:00:00Z', updated_at: '2026-02-21T08:00:00Z' },
  { id: 'LV-003', requester_id: 'emp-3', request_type: 'sick', start_date: '2026-02-20', end_date: '2026-02-20', reason: 'Feeling unwell', status: 'manager_approved', submitted_at: '2026-02-20T07:00:00Z', updated_at: '2026-02-20T08:00:00Z' },
  { id: 'LV-004', requester_id: 'emp-10', request_type: 'WFH', start_date: '2026-02-25', end_date: '2026-02-26', reason: 'Remote sprint work', status: 'needs_info', submitted_at: '2026-02-19T10:00:00Z', updated_at: '2026-02-19T16:00:00Z' },
  { id: 'LV-005', requester_id: 'emp-5', request_type: 'PTO', start_date: '2026-03-10', end_date: '2026-03-14', reason: 'Family vacation', status: 'submitted', submitted_at: '2026-02-18T09:00:00Z', updated_at: '2026-02-18T09:00:00Z' },
];

export const tickets: HRTicket[] = [
  { id: 'TKT-001', requester_id: 'emp-4', ticket_type: 'policy_question', subject: 'Overtime policy for sales events', description: 'Do we get compensated for weekend client events?', status: 'open', assigned_to: null, created_at: '2026-02-15T10:00:00Z', updated_at: '2026-02-15T10:00:00Z', private_flag: false },
  { id: 'TKT-002', requester_id: 'emp-2', ticket_type: 'benefits', subject: 'Dental coverage question', description: 'Is dental covered under our health plan?', status: 'in_progress', assigned_to: 'emp-9', created_at: '2026-02-10T14:00:00Z', updated_at: '2026-02-12T09:00:00Z', private_flag: false },
  { id: 'TKT-003', requester_id: 'emp-5', ticket_type: 'payroll', subject: 'Payslip discrepancy', description: 'My January payslip seems to be missing the transport allowance.', status: 'open', assigned_to: null, created_at: '2026-02-08T11:00:00Z', updated_at: '2026-02-08T11:00:00Z', private_flag: false },
];

export const handbookChunks: HandbookChunk[] = [
  { id: 'hb-1', source_title: 'Enfactum Employee Handbook 2025', section: 'Expense & Reimbursement Policy', page_hint: 'p. 12', chunk_text: 'All employees must submit expense claims within 30 calendar days of the expense date. Claims submitted after 30 days may be rejected at management discretion. A valid receipt is required for all expenses—no receipt means no reimbursement.', tags: ['expenses', 'reimbursements'], last_updated: '2025-01-01' },
  { id: 'hb-2', source_title: 'Enfactum Employee Handbook 2025', section: 'Expense & Reimbursement Policy', page_hint: 'p. 13', chunk_text: 'Expense claims must include: date, amount, category, and business purpose. For meal expenses, the names of all attendees must be listed. If the expense is billable to a client project, include the project code.', tags: ['expenses', 'reimbursements'], last_updated: '2025-01-01' },
  { id: 'hb-3', source_title: 'Enfactum Employee Handbook 2025', section: 'Expense & Reimbursement Policy', page_hint: 'p. 14', chunk_text: 'All expense claims require manager approval. Managers should review and respond within 3 business days. After manager approval, the Finance team validates policy compliance and processes reimbursement with the next payroll cycle.', tags: ['expenses', 'reimbursements', 'payroll'], last_updated: '2025-01-01' },
  { id: 'hb-4', source_title: 'Enfactum Employee Handbook 2025', section: 'Payroll', page_hint: 'p. 8', chunk_text: 'Payroll is processed monthly. Payday is on the 7th of each month. If the 7th falls on a weekend or public holiday, payment will be made on the preceding business day. Approved reimbursements are included in the next payroll cycle.', tags: ['payroll'], last_updated: '2025-01-01' },
  { id: 'hb-5', source_title: 'Enfactum Employee Handbook 2025', section: 'Leave Policy – PTO', page_hint: 'p. 18', chunk_text: 'All PTO (Paid Time Off) requests must be submitted through the official HRMS (Payboy). Enfactum HR Hub serves as a tracker and notification tool only—it is not the system of record for PTO approvals.', tags: ['PTO', 'HRMS', 'leave'], last_updated: '2025-01-01' },
  { id: 'hb-6', source_title: 'Enfactum Employee Handbook 2025', section: 'Leave Policy – PTO', page_hint: 'p. 19', chunk_text: 'Employees are entitled to 14 days of annual leave in their first year, increasing by 1 day per year of service up to a maximum of 21 days. Unused leave may be carried over to the next calendar year, up to a maximum of 5 days.', tags: ['PTO', 'leave'], last_updated: '2025-01-01' },
  { id: 'hb-7', source_title: 'Enfactum Employee Handbook 2025', section: 'Remote Work & WFH Policy', page_hint: 'p. 22', chunk_text: 'Employees may request to work from home (WFH) with manager approval. WFH requests should be submitted at least 1 business day in advance except for emergencies. Employees must be reachable during core hours (10am–4pm SGT).', tags: ['remote_work', 'WFH'], last_updated: '2025-01-01' },
  { id: 'hb-8', source_title: 'Enfactum Employee Handbook 2025', section: 'Remote Work Security', page_hint: 'p. 24', chunk_text: 'When working remotely: always use the company VPN, connect only to secure Wi-Fi networks, never use public Wi-Fi without VPN, lock your device when stepping away, and report any security incidents immediately to IT.', tags: ['remote_work', 'security'], last_updated: '2025-01-01' },
  { id: 'hb-9', source_title: 'Enfactum Employee Handbook 2025', section: 'Harassment & Grievance Policy', page_hint: 'p. 30', chunk_text: 'Enfactum has zero tolerance for harassment of any kind. Employees who experience or witness harassment should report it immediately through a private HR ticket. All reports are treated confidentially and investigated promptly.', tags: ['harassment', 'grievance'], last_updated: '2025-01-01' },
  { id: 'hb-10', source_title: 'Enfactum Employee Handbook 2025', section: 'Procurement & Spending Limits', page_hint: 'p. 35', chunk_text: 'Individual purchases under SGD 500 require manager approval only. Purchases between SGD 500–5000 require both manager and Finance approval. Purchases above SGD 5000 require VP-level sign-off and a formal procurement request.', tags: ['procurement', 'expenses'], last_updated: '2025-01-01' },
];

// Onboarding
export const onboardingTemplates: OnboardingTemplate[] = [
  { id: 'tmpl-1', template_name: 'SG Full-Time Engineering', country: 'Singapore', role_family: 'Engineering', is_default: true },
  { id: 'tmpl-2', template_name: 'SG Full-Time Business', country: 'Singapore', role_family: 'Business', is_default: true },
  { id: 'tmpl-3', template_name: 'India Full-Time Engineering', country: 'India', role_family: 'Engineering', is_default: true },
  { id: 'tmpl-4', template_name: 'MY Contract Engineering', country: 'Malaysia', role_family: 'Engineering', is_default: false },
];

export const onboardingCases: OnboardingCase[] = [
  { id: 'obc-1', employee_id: 'emp-10', start_date: '2024-07-01', role: 'Junior Developer', country: 'Singapore', manager_id: 'emp-6', status: 'complete', created_at: '2024-06-15T10:00:00Z' },
  { id: 'obc-2', employee_id: 'emp-11', start_date: '2026-04-01', role: 'Data Analyst', country: 'India', manager_id: 'emp-6', status: 'in_progress', created_at: '2026-03-10T10:00:00Z' },
];

export const onboardingTasks: OnboardingTask[] = [
  { id: 'obt-1', onboarding_case_id: 'obc-2', task_name: 'Set up company email', owner_role: 'IT', owner_employee_id: null, due_date: '2026-03-25', status: 'done', notes: '', attachments: [] },
  { id: 'obt-2', onboarding_case_id: 'obc-2', task_name: 'Assign laptop and peripherals', owner_role: 'IT', owner_employee_id: null, due_date: '2026-03-28', status: 'doing', notes: 'Waiting for laptop delivery', attachments: [] },
  { id: 'obt-3', onboarding_case_id: 'obc-2', task_name: 'Complete employment docs', owner_role: 'HR', owner_employee_id: 'emp-9', due_date: '2026-03-20', status: 'done', notes: '', attachments: [] },
  { id: 'obt-4', onboarding_case_id: 'obc-2', task_name: 'Schedule orientation meeting', owner_role: 'Manager', owner_employee_id: 'emp-6', due_date: '2026-03-30', status: 'todo', notes: '', attachments: [] },
  { id: 'obt-5', onboarding_case_id: 'obc-2', task_name: 'Set up payroll account', owner_role: 'Finance', owner_employee_id: 'emp-8', due_date: '2026-03-25', status: 'done', notes: '', attachments: [] },
  { id: 'obt-6', onboarding_case_id: 'obc-2', task_name: 'Read employee handbook', owner_role: 'Employee', owner_employee_id: 'emp-11', due_date: '2026-04-05', status: 'todo', notes: '', attachments: [] },
  { id: 'obt-7', onboarding_case_id: 'obc-2', task_name: 'Complete insurance enrollment', owner_role: 'HR', owner_employee_id: 'emp-9', due_date: '2026-04-01', status: 'todo', notes: '', attachments: [] },
];

// Exit
export const exitCases: ExitCase[] = [
  { id: 'exit-1', employee_id: 'emp-5', last_working_day: '2026-04-15', resignation_date: '2026-03-01', exit_reason: 'Personal reasons', status: 'in_progress' },
  { id: 'exit-2', employee_id: 'emp-12', last_working_day: '2025-12-31', resignation_date: '2025-11-15', exit_reason: 'Contract ended', status: 'closed' },
];

export const fullFinalSettlements: FullFinalSettlement[] = [
  { id: 'ff-1', exit_case_id: 'exit-1', country: 'Singapore', payable_amount: 8500, deductions: 350, net_amount: 8150, payout_date: '2026-04-30', status: 'draft', ais_impact_flag: true, notes: 'Pending manager approval', attachments: [] },
  { id: 'ff-2', exit_case_id: 'exit-2', country: 'Malaysia', payable_amount: 5200, deductions: 200, net_amount: 5000, payout_date: '2026-01-15', status: 'paid', ais_impact_flag: false, notes: 'Processed', attachments: ['ff_doc_002.pdf'] },
];

// Insurance
export const insurancePolicies: InsurancePolicy[] = [
  { id: 'ins-1', insurer_name: 'Great Eastern', policy_name: 'Group Hospitalisation & Surgical', policy_number: 'GHS-2025-001', coverage_summary: 'Inpatient hospitalisation, surgical, pre/post hospitalisation. Annual limit SGD 100,000.', portal_link: 'https://portal.greateastern.com', hotline: '+65 6248 2888', document_link: 'https://docs.example.com/ghs.pdf', country: 'Singapore' },
  { id: 'ins-2', insurer_name: 'Great Eastern', policy_name: 'Group Outpatient', policy_number: 'GOP-2025-001', coverage_summary: 'GP visits, specialist visits, dental. Annual limit SGD 2,000 per employee.', portal_link: 'https://portal.greateastern.com', hotline: '+65 6248 2888', document_link: 'https://docs.example.com/gop.pdf', country: 'Singapore' },
  { id: 'ins-3', insurer_name: 'ICICI Lombard', policy_name: 'Group Mediclaim', policy_number: 'GMC-2025-IN', coverage_summary: 'Hospitalisation, day care procedures. Sum insured INR 5,00,000.', portal_link: 'https://portal.icicilombard.com', hotline: '+91 1800 2666', document_link: 'https://docs.example.com/gmc.pdf', country: 'India' },
];

export const employeeInsurance: EmployeeInsurance[] = [
  { id: 'ei-1', employee_id: 'emp-1', insurance_policy_id: 'ins-1', member_id: 'GE-001-AC', dependents_summary: '1 spouse', effective_from: '2023-03-15', effective_to: '2026-12-31' },
  { id: 'ei-2', employee_id: 'emp-1', insurance_policy_id: 'ins-2', member_id: 'GE-002-AC', dependents_summary: 'Self only', effective_from: '2023-03-15', effective_to: '2026-12-31' },
  { id: 'ei-3', employee_id: 'emp-2', insurance_policy_id: 'ins-1', member_id: 'GE-001-BK', dependents_summary: 'Self only', effective_from: '2023-06-01', effective_to: '2026-12-31' },
  { id: 'ei-4', employee_id: 'emp-11', insurance_policy_id: 'ins-3', member_id: 'IL-001-PS', dependents_summary: '2 dependents', effective_from: '2026-04-01', effective_to: '2027-03-31' },
];

// Payroll
export const payrollRuns: PayrollRun[] = [
  { id: 'pr-1', country: 'Singapore', payroll_month: '2026-02', status: 'complete', pay_date: '2026-03-07', ais_submission_status: 'submitted', ais_submission_date: '2026-03-10', ais_reference: 'AIS-2026-02-SG', notes: '' },
  { id: 'pr-2', country: 'Singapore', payroll_month: '2026-03', status: 'preparing', pay_date: '2026-04-07', ais_submission_status: 'not_started', notes: 'In progress' },
  { id: 'pr-3', country: 'India', payroll_month: '2026-03', status: 'preparing', pay_date: '2026-04-07', notes: 'Awaiting inputs' },
];

export const payrollLineItems: PayrollLineItem[] = [
  { id: 'pli-1', payroll_run_id: 'pr-1', employee_id: 'emp-1', gross_pay: 7500, allowances: 500, deductions: 1200, net_pay: 6800, payslip_link: 'https://drive.google.com/payslips/emp1-202602', status: 'ready' },
  { id: 'pli-2', payroll_run_id: 'pr-1', employee_id: 'emp-2', gross_pay: 7000, allowances: 400, deductions: 1100, net_pay: 6300, payslip_link: 'https://drive.google.com/payslips/emp2-202602', status: 'ready' },
  { id: 'pli-3', payroll_run_id: 'pr-1', employee_id: 'emp-3', gross_pay: 5500, allowances: 300, deductions: 900, net_pay: 4900, payslip_link: 'https://drive.google.com/payslips/emp3-202602', status: 'ready' },
  { id: 'pli-4', payroll_run_id: 'pr-2', employee_id: 'emp-1', gross_pay: 7500, allowances: 500, deductions: 1200, net_pay: 6800, payslip_link: '', status: 'pending' },
  { id: 'pli-5', payroll_run_id: 'pr-2', employee_id: 'emp-2', gross_pay: 7000, allowances: 400, deductions: 1100, net_pay: 6300, payslip_link: '', status: 'pending' },
];

// Vendors
export const vendors: Vendor[] = [
  { id: 'vnd-1', vendor_name: 'CloudTech Solutions', country: 'Singapore', service_category: 'IT Services', contact_name: 'Mike Tan', contact_email: 'mike@cloudtech.sg', payment_terms: 'Net 30', status: 'active' },
  { id: 'vnd-2', vendor_name: 'Creative Minds Agency', country: 'Singapore', service_category: 'Creative', contact_name: 'Sarah Lim', contact_email: 'sarah@creativeminds.sg', payment_terms: 'Net 15', status: 'active' },
  { id: 'vnd-3', vendor_name: 'DataPro India', country: 'India', service_category: 'Data Services', contact_name: 'Raj Mehta', contact_email: 'raj@datapro.in', payment_terms: 'Net 45', status: 'active' },
  { id: 'vnd-4', vendor_name: 'Old Vendor Co', country: 'Malaysia', service_category: 'Consulting', contact_name: 'Ali Ismail', contact_email: 'ali@oldvendor.my', payment_terms: 'Net 30', status: 'inactive' },
];

export const vendorServices: VendorService[] = [
  { id: 'vs-1', vendor_id: 'vnd-1', service_name: 'Cloud Hosting', unit_type: 'project', default_rate: 5000, currency: 'SGD' },
  { id: 'vs-2', vendor_id: 'vnd-1', service_name: 'DevOps Support', unit_type: 'hour', default_rate: 150, currency: 'SGD' },
  { id: 'vs-3', vendor_id: 'vnd-2', service_name: 'Brand Design', unit_type: 'project', default_rate: 8000, currency: 'SGD' },
  { id: 'vs-4', vendor_id: 'vnd-2', service_name: 'Video Production', unit_type: 'day', default_rate: 2500, currency: 'SGD' },
  { id: 'vs-5', vendor_id: 'vnd-3', service_name: 'Data Entry', unit_type: 'hour', default_rate: 25, currency: 'USD' },
];

export const internalRateCards: InternalRateCard[] = [
  { id: 'irc-1', role: 'Strategy', country: 'Singapore', rate_per_hour: 250, currency: 'SGD', effective_from: '2026-01-01', effective_to: '2026-12-31' },
  { id: 'irc-2', role: 'PM', country: 'Singapore', rate_per_hour: 200, currency: 'SGD', effective_from: '2026-01-01', effective_to: '2026-12-31' },
  { id: 'irc-3', role: 'Design', country: 'Singapore', rate_per_hour: 180, currency: 'SGD', effective_from: '2026-01-01', effective_to: '2026-12-31' },
  { id: 'irc-4', role: 'Copy', country: 'Singapore', rate_per_hour: 150, currency: 'SGD', effective_from: '2026-01-01', effective_to: '2026-12-31' },
  { id: 'irc-5', role: 'Dev', country: 'Singapore', rate_per_hour: 200, currency: 'SGD', effective_from: '2026-01-01', effective_to: '2026-12-31' },
  { id: 'irc-6', role: 'Video', country: 'Singapore', rate_per_hour: 170, currency: 'SGD', effective_from: '2026-01-01', effective_to: '2026-12-31' },
  { id: 'irc-7', role: 'Performance', country: 'Singapore', rate_per_hour: 190, currency: 'SGD', effective_from: '2026-01-01', effective_to: '2026-12-31' },
  { id: 'irc-8', role: 'Dev', country: 'India', rate_per_hour: 80, currency: 'USD', effective_from: '2026-01-01', effective_to: '2026-12-31' },
  { id: 'irc-9', role: 'Design', country: 'India', rate_per_hour: 60, currency: 'USD', effective_from: '2026-01-01', effective_to: '2026-12-31' },
];

export const defaultAdminSettings: AdminSettings = {
  google_chat_webhook_url: '',
  whatsapp_provider_key: '',
};
