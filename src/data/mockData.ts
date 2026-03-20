import { Employee, Claim, ClaimApproval, LeaveWFHRequest, HRTicket, HandbookChunk, OnboardingCase, OnboardingTemplate, OnboardingTask, ExitCase, FullFinalSettlement, InsurancePolicy, EmployeeInsurance, PayrollRun, PayrollLineItem, Vendor, VendorService, InternalRateCard, AdminSettings, Exception, PolicyRule, MonthEndClose, MonthEndCloseTask, DriveLink, DriveFolderTemplate } from '@/types/hr';

export const employees: Employee[] = [
  { id: 'emp-1', full_name: 'Alice Chen', email: 'alice@enfactum.com', role_title: 'Software Engineer', department: 'Engineering', location: 'Singapore', manager_id: 'emp-6', employment_status: 'active', start_date: '2023-03-15', is_manager: false, is_finance: false, is_hr_admin: false, lifecycle_status: 'active', country: 'Singapore', employment_type: 'full_time', employee_code: 'EF-001', cost_center: 'CC-ENG', employee_drive_folder_url: 'https://drive.google.com/drive/folders/abc123_alice', payslips_folder_url: 'https://drive.google.com/drive/folders/abc123_alice_payslips' },
  { id: 'emp-2', full_name: 'Bob Kumar', email: 'bob@enfactum.com', role_title: 'Product Designer', department: 'Engineering', location: 'Singapore', manager_id: 'emp-6', employment_status: 'active', start_date: '2023-06-01', is_manager: false, is_finance: false, is_hr_admin: false, lifecycle_status: 'active', country: 'Singapore', employment_type: 'full_time', employee_code: 'EF-002', cost_center: 'CC-ENG' },
  { id: 'emp-3', full_name: 'Carol Tan', email: 'carol@enfactum.com', role_title: 'Marketing Executive', department: 'Marketing', location: 'Singapore', manager_id: 'emp-7', employment_status: 'active', start_date: '2022-11-10', is_manager: false, is_finance: false, is_hr_admin: false, lifecycle_status: 'active', country: 'Singapore', employment_type: 'full_time', employee_code: 'EF-003', cost_center: 'CC-MKT' },
  { id: 'emp-4', full_name: 'David Lee', email: 'david@enfactum.com', role_title: 'Sales Representative', department: 'Sales', location: 'Singapore', manager_id: 'emp-7', employment_status: 'active', start_date: '2024-01-08', is_manager: false, is_finance: false, is_hr_admin: false, lifecycle_status: 'active', country: 'Singapore', employment_type: 'full_time', employee_code: 'EF-004', cost_center: 'CC-SALES' },
  { id: 'emp-5', full_name: 'Eve Wong', email: 'eve@enfactum.com', role_title: 'Operations Coordinator', department: 'Operations', location: 'Singapore', manager_id: 'emp-7', employment_status: 'active', start_date: '2023-09-20', is_manager: false, is_finance: false, is_hr_admin: false, lifecycle_status: 'exit_initiated', country: 'Singapore', employment_type: 'full_time', employee_code: 'EF-005', cost_center: 'CC-OPS', exit_folder_url: 'https://drive.google.com/drive/folders/abc123_eve_exit' },
  { id: 'emp-6', full_name: 'Frank Lim', email: 'frank@enfactum.com', role_title: 'Engineering Manager', department: 'Engineering', location: 'Singapore', manager_id: null, employment_status: 'active', start_date: '2021-05-01', is_manager: true, is_finance: false, is_hr_admin: false, lifecycle_status: 'active', country: 'Singapore', employment_type: 'full_time', employee_code: 'EF-006', cost_center: 'CC-ENG' },
  { id: 'emp-7', full_name: 'Grace Ng', email: 'grace@enfactum.com', role_title: 'Head of Business', department: 'Business', location: 'Singapore', manager_id: null, employment_status: 'active', start_date: '2020-08-15', is_manager: true, is_finance: false, is_hr_admin: false, lifecycle_status: 'active', country: 'Singapore', employment_type: 'full_time', employee_code: 'EF-007', cost_center: 'CC-BIZ' },
  { id: 'emp-8', full_name: 'Henry Ong', email: 'henry@enfactum.com', role_title: 'Finance Analyst', department: 'Finance', location: 'Singapore', manager_id: null, employment_status: 'active', start_date: '2022-02-01', is_manager: false, is_finance: true, is_hr_admin: false, lifecycle_status: 'active', country: 'Singapore', employment_type: 'full_time', employee_code: 'EF-008', cost_center: 'CC-FIN' },
  { id: 'emp-9', full_name: 'Irene Patel', email: 'irene@enfactum.com', role_title: 'HR Manager', department: 'People & Culture', location: 'Singapore', manager_id: null, employment_status: 'active', start_date: '2021-01-15', is_manager: false, is_finance: false, is_hr_admin: true, lifecycle_status: 'active', country: 'Singapore', employment_type: 'full_time', employee_code: 'EF-009', cost_center: 'CC-HR' },
  { id: 'emp-10', full_name: 'James Ho', email: 'james@enfactum.com', role_title: 'Junior Developer', department: 'Engineering', location: 'Singapore', manager_id: 'emp-6', employment_status: 'active', start_date: '2024-07-01', is_manager: false, is_finance: false, is_hr_admin: false, lifecycle_status: 'new_hire', country: 'Singapore', employment_type: 'full_time', employee_code: 'EF-010', cost_center: 'CC-ENG', onboarding_folder_url: 'https://drive.google.com/drive/folders/abc123_james_onb' },
  { id: 'emp-11', full_name: 'Priya Sharma', email: 'priya@enfactum.com', role_title: 'Data Analyst', department: 'Engineering', location: 'India', manager_id: 'emp-6', employment_status: 'active', start_date: '2026-04-01', is_manager: false, is_finance: false, is_hr_admin: false, lifecycle_status: 'new_hire', country: 'India', employment_type: 'full_time', employee_code: 'EF-011', cost_center: 'CC-ENG-IN' },
  { id: 'emp-12', full_name: 'Ahmad Rizal', email: 'ahmad@enfactum.com', role_title: 'QA Engineer', department: 'Engineering', location: 'Malaysia', manager_id: 'emp-6', employment_status: 'inactive', start_date: '2022-03-01', is_manager: false, is_finance: false, is_hr_admin: false, lifecycle_status: 'exited', country: 'Malaysia', employment_type: 'contract', employee_code: 'EF-012', cost_center: 'CC-ENG-MY' },
];

export const claims: Claim[] = [
  { id: 'CLM-001', claimant_id: 'emp-1', category: 'business_travel', amount: 450, currency: 'SGD', expense_date: '2026-02-01', business_purpose: 'Client visit to Jakarta office', payment_method: 'personal_card', receipt_required: true, receipt_files: ['receipt_001.pdf'], status: 'submitted', submitted_at: '2026-02-03T09:00:00Z', updated_at: '2026-02-03T09:00:00Z', is_reimbursement: false, payout_mode: 'payroll' },
  { id: 'CLM-002', claimant_id: 'emp-1', category: 'meals_travel', amount: 85, currency: 'SGD', expense_date: '2026-02-02', business_purpose: 'Lunch during Jakarta trip', attendees: 'Alice Chen, Client PM', payment_method: 'personal_cash', receipt_required: true, receipt_files: ['receipt_002.jpg'], status: 'manager_approved', submitted_at: '2026-02-03T10:00:00Z', updated_at: '2026-02-05T14:00:00Z', is_reimbursement: false, payout_mode: 'payroll' },
  { id: 'CLM-003', claimant_id: 'emp-2', category: 'professional_development', amount: 200, currency: 'SGD', expense_date: '2026-01-15', business_purpose: 'UX Conference ticket', payment_method: 'personal_card', receipt_required: true, receipt_files: ['receipt_003.pdf'], status: 'paid', submitted_at: '2026-01-16T08:00:00Z', updated_at: '2026-02-07T12:00:00Z', is_reimbursement: false, payout_mode: 'payroll' },
  { id: 'CLM-004', claimant_id: 'emp-3', category: 'client_meeting_meals', amount: 320, currency: 'SGD', expense_date: '2026-02-10', business_purpose: 'Client dinner with Acme Corp team', payment_method: 'personal_card', receipt_required: true, receipt_files: ['receipt_004.pdf'], status: 'needs_info', submitted_at: '2026-02-11T11:00:00Z', updated_at: '2026-02-12T09:00:00Z', is_reimbursement: false, payout_mode: 'payroll' },
  { id: 'CLM-005', claimant_id: 'emp-4', category: 'ground_transport', amount: 45, currency: 'SGD', expense_date: '2026-02-14', business_purpose: 'Grab to client office', payment_method: 'personal_cash', receipt_required: true, receipt_files: ['receipt_005.png'], status: 'submitted', submitted_at: '2026-02-14T18:00:00Z', updated_at: '2026-02-14T18:00:00Z', is_reimbursement: false, payout_mode: 'payroll' },
  { id: 'CLM-006', claimant_id: 'emp-5', category: 'home_office_supplies', amount: 150, currency: 'SGD', expense_date: '2026-01-28', business_purpose: 'Monitor stand and keyboard', payment_method: 'personal_card', receipt_required: true, receipt_files: ['receipt_006.pdf'], status: 'finance_validated', submitted_at: '2026-01-29T10:00:00Z', updated_at: '2026-02-08T16:00:00Z', is_reimbursement: false, payout_mode: 'payroll' },
  { id: 'CLM-007', claimant_id: 'emp-10', category: 'phone_internet', amount: 60, currency: 'SGD', expense_date: '2026-02-01', business_purpose: 'Monthly mobile plan', payment_method: 'personal_cash', receipt_required: true, receipt_files: [], status: 'draft', submitted_at: '2026-02-15T10:00:00Z', updated_at: '2026-02-15T10:00:00Z', is_reimbursement: false, payout_mode: 'payroll', exception_flag: true, exception_id: 'exc-2' },
  { id: 'CLM-008', claimant_id: 'emp-1', category: 'client_entertainment', amount: 500, currency: 'SGD', expense_date: '2025-12-20', business_purpose: 'Year-end client appreciation dinner', attendees: 'Alice, Client CTO, Client PM', payment_method: 'personal_card', receipt_required: true, receipt_files: ['receipt_008.pdf'], status: 'rejected', submitted_at: '2026-01-25T09:00:00Z', updated_at: '2026-01-27T11:00:00Z', is_reimbursement: false, payout_mode: 'payroll', exception_flag: true, exception_id: 'exc-1' },
  { id: 'CLM-009', claimant_id: 'emp-1', category: 'reimbursement', amount: 120, currency: 'SGD', expense_date: '2026-03-01', business_purpose: 'Monthly mobile plan reimbursement', payment_method: 'personal_cash', receipt_required: true, receipt_files: ['receipt_009.pdf'], status: 'submitted', submitted_at: '2026-03-02T09:00:00Z', updated_at: '2026-03-02T09:00:00Z', is_reimbursement: true, reimbursement_type: 'mobile_internet_reimb', reimbursement_description: 'Monthly Singtel mobile plan for work use', payout_mode: 'payroll' },
  { id: 'CLM-010', claimant_id: 'emp-4', category: 'client_entertainment', amount: 650, currency: 'SGD', expense_date: '2026-03-05', business_purpose: 'Client dinner — over limit', attendees: 'David, Client VP', payment_method: 'personal_card', receipt_required: true, receipt_files: ['receipt_010.pdf'], status: 'submitted', submitted_at: '2026-03-06T09:00:00Z', updated_at: '2026-03-06T09:00:00Z', is_reimbursement: false, payout_mode: 'payroll', exception_flag: true, exception_id: 'exc-3' },
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
  { id: 'hb-1', source_title: 'Enfactum Employee Handbook 2025', section: 'Expense & Reimbursement Policy', page_hint: 'p. 12', chunk_text: 'All employees must submit expense claims within 30 calendar days of the expense date.', tags: ['expenses', 'reimbursements'], last_updated: '2025-01-01' },
  { id: 'hb-2', source_title: 'Enfactum Employee Handbook 2025', section: 'Expense & Reimbursement Policy', page_hint: 'p. 13', chunk_text: 'Expense claims must include: date, amount, category, and business purpose.', tags: ['expenses', 'reimbursements'], last_updated: '2025-01-01' },
  { id: 'hb-3', source_title: 'Enfactum Employee Handbook 2025', section: 'Expense & Reimbursement Policy', page_hint: 'p. 14', chunk_text: 'All expense claims require manager approval. Managers should review within 3 business days.', tags: ['expenses', 'reimbursements', 'payroll'], last_updated: '2025-01-01' },
  { id: 'hb-4', source_title: 'Enfactum Employee Handbook 2025', section: 'Payroll', page_hint: 'p. 8', chunk_text: 'Payroll is processed monthly. Payday is on the 7th of each month.', tags: ['payroll'], last_updated: '2025-01-01' },
  { id: 'hb-5', source_title: 'Enfactum Employee Handbook 2025', section: 'Leave Policy – PTO', page_hint: 'p. 18', chunk_text: 'All PTO requests must be submitted through the official HRMS (Payboy).', tags: ['PTO', 'HRMS', 'leave'], last_updated: '2025-01-01' },
  { id: 'hb-6', source_title: 'Enfactum Employee Handbook 2025', section: 'Leave Policy – PTO', page_hint: 'p. 19', chunk_text: 'Employees are entitled to 14 days of annual leave in their first year.', tags: ['PTO', 'leave'], last_updated: '2025-01-01' },
  { id: 'hb-7', source_title: 'Enfactum Employee Handbook 2025', section: 'Remote Work & WFH Policy', page_hint: 'p. 22', chunk_text: 'WFH requests should be submitted at least 1 business day in advance.', tags: ['remote_work', 'WFH'], last_updated: '2025-01-01' },
  { id: 'hb-8', source_title: 'Enfactum Employee Handbook 2025', section: 'Remote Work Security', page_hint: 'p. 24', chunk_text: 'When working remotely: always use the company VPN.', tags: ['remote_work', 'security'], last_updated: '2025-01-01' },
  { id: 'hb-9', source_title: 'Enfactum Employee Handbook 2025', section: 'Harassment & Grievance Policy', page_hint: 'p. 30', chunk_text: 'Enfactum has zero tolerance for harassment of any kind.', tags: ['harassment', 'grievance'], last_updated: '2025-01-01' },
  { id: 'hb-10', source_title: 'Enfactum Employee Handbook 2025', section: 'Procurement & Spending Limits', page_hint: 'p. 35', chunk_text: 'Individual purchases under SGD 500 require manager approval only.', tags: ['procurement', 'expenses'], last_updated: '2025-01-01' },
];

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
  { id: 'obt-6', onboarding_case_id: 'obc-2', task_name: 'Read employee handbook', owner_role: 'Employee', owner_employee_id: 'emp-11', due_date: '2026-04-05', status: 'todo', notes: '', attachments: [], exception_flag: true, exception_id: 'exc-7' },
  { id: 'obt-7', onboarding_case_id: 'obc-2', task_name: 'Complete insurance enrollment', owner_role: 'HR', owner_employee_id: 'emp-9', due_date: '2026-04-01', status: 'todo', notes: '', attachments: [] },
];

export const exitCases: ExitCase[] = [
  { id: 'exit-1', employee_id: 'emp-5', last_working_day: '2026-04-15', resignation_date: '2026-03-01', exit_reason: 'Personal reasons', status: 'in_progress' },
  { id: 'exit-2', employee_id: 'emp-12', last_working_day: '2025-12-31', resignation_date: '2025-11-15', exit_reason: 'Contract ended', status: 'closed' },
];

export const fullFinalSettlements: FullFinalSettlement[] = [
  { id: 'ff-1', exit_case_id: 'exit-1', country: 'Singapore', payable_amount: 8500, deductions: 350, net_amount: 8150, payout_date: '2026-04-30', status: 'draft', ais_impact_flag: true, notes: 'Pending manager approval', attachments: [], exception_flag: true, exception_id: 'exc-8' },
  { id: 'ff-2', exit_case_id: 'exit-2', country: 'Malaysia', payable_amount: 5200, deductions: 200, net_amount: 5000, payout_date: '2026-01-15', status: 'paid', ais_impact_flag: false, notes: 'Processed', attachments: ['ff_doc_002.pdf'] },
];

export const insurancePolicies: InsurancePolicy[] = [
  { id: 'ins-1', insurer_name: 'Great Eastern', policy_name: 'Group Hospitalisation & Surgical', policy_number: 'GHS-2025-001', coverage_summary: 'Inpatient hospitalisation, surgical. Annual limit SGD 100,000.', portal_link: 'https://portal.greateastern.com', hotline: '+65 6248 2888', document_link: 'https://drive.google.com/docs/ghs_policy.pdf', country: 'Singapore' },
  { id: 'ins-2', insurer_name: 'Great Eastern', policy_name: 'Group Outpatient', policy_number: 'GOP-2025-001', coverage_summary: 'GP visits, specialist, dental. Annual limit SGD 2,000.', portal_link: 'https://portal.greateastern.com', hotline: '+65 6248 2888', document_link: 'https://drive.google.com/docs/gop_policy.pdf', country: 'Singapore' },
  { id: 'ins-3', insurer_name: 'ICICI Lombard', policy_name: 'Group Mediclaim', policy_number: 'GMC-2025-IN', coverage_summary: 'Hospitalisation, day care. Sum insured INR 5,00,000.', portal_link: 'https://portal.icicilombard.com', hotline: '+91 1800 2666', document_link: 'https://drive.google.com/docs/gmc_policy.pdf', country: 'India' },
];

export const employeeInsurance: EmployeeInsurance[] = [
  { id: 'ei-1', employee_id: 'emp-1', insurance_policy_id: 'ins-1', member_id: 'GE-001-AC', dependents_summary: '1 spouse', effective_from: '2023-03-15', effective_to: '2026-12-31' },
  { id: 'ei-2', employee_id: 'emp-1', insurance_policy_id: 'ins-2', member_id: 'GE-002-AC', dependents_summary: 'Self only', effective_from: '2023-03-15', effective_to: '2026-12-31' },
  { id: 'ei-3', employee_id: 'emp-2', insurance_policy_id: 'ins-1', member_id: 'GE-001-BK', dependents_summary: 'Self only', effective_from: '2023-06-01', effective_to: '2026-12-31' },
  { id: 'ei-4', employee_id: 'emp-11', insurance_policy_id: 'ins-3', member_id: 'IL-001-PS', dependents_summary: '2 dependents', effective_from: '2026-04-01', effective_to: '2027-03-31' },
];

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
  { id: 'pli-5', payroll_run_id: 'pr-2', employee_id: 'emp-2', gross_pay: 7000, allowances: 400, deductions: 1100, net_pay: 6300, payslip_link: '', status: 'pending', exception_flag: true, exception_id: 'exc-9' },
];

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

export const defaultAdminSettings: AdminSettings = { google_chat_webhook_url: '', whatsapp_provider_key: '' };

// === NEW: Exceptions ===
export const exceptions: Exception[] = [
  { id: 'exc-1', entity_type: 'claim', entity_id: 'CLM-008', country: 'Singapore', severity: 'high', reason_code: 'late_submission', reason_notes: 'Claim submitted 36 days after expense date. Exceeds 30-day window.', status: 'resolved', created_by: 'emp-9', assigned_to: 'emp-9', created_at: '2026-01-25T09:00:00Z', resolved_at: '2026-01-27T11:00:00Z' },
  { id: 'exc-2', entity_type: 'claim', entity_id: 'CLM-007', country: 'Singapore', severity: 'medium', reason_code: 'missing_receipt', reason_notes: 'No receipt attached for phone/internet claim.', status: 'open', created_by: 'emp-9', assigned_to: null, created_at: '2026-02-15T10:00:00Z', resolved_at: null },
  { id: 'exc-3', entity_type: 'claim', entity_id: 'CLM-010', country: 'Singapore', severity: 'high', reason_code: 'over_limit', reason_notes: 'Client entertainment claim SGD 650 exceeds SGD 500 limit — requires manager+finance approval.', status: 'open', created_by: 'emp-9', assigned_to: 'emp-8', created_at: '2026-03-06T09:00:00Z', resolved_at: null },
  { id: 'exc-4', entity_type: 'claim', entity_id: 'CLM-005', country: 'Singapore', severity: 'low', reason_code: 'non_standard_vendor', reason_notes: 'Grab transport vendor not in master vendor list. Auto-flagged.', status: 'waived', created_by: 'emp-9', assigned_to: null, created_at: '2026-02-14T18:00:00Z', resolved_at: '2026-02-15T09:00:00Z' },
  { id: 'exc-5', entity_type: 'claim', entity_id: 'CLM-004', severity: 'medium', reason_code: 'policy_conflict', reason_notes: 'Attendee list incomplete for meal expense — returned for info.', status: 'in_review', created_by: 'emp-7', assigned_to: 'emp-3', created_at: '2026-02-12T09:00:00Z', resolved_at: null },
  { id: 'exc-6', entity_type: 'onboarding_task', entity_id: 'obt-4', country: 'India', severity: 'medium', reason_code: 'missing_doc', reason_notes: 'Orientation meeting not yet scheduled — approaching start date.', status: 'open', created_by: 'emp-9', assigned_to: 'emp-6', created_at: '2026-03-18T10:00:00Z', resolved_at: null },
  { id: 'exc-7', entity_type: 'onboarding_task', entity_id: 'obt-6', country: 'India', severity: 'low', reason_code: 'missing_doc', reason_notes: 'Employee handbook not yet read — due soon.', status: 'open', created_by: 'emp-9', assigned_to: 'emp-11', created_at: '2026-03-18T10:00:00Z', resolved_at: null },
  { id: 'exc-8', entity_type: 'exit_ff', entity_id: 'ff-1', country: 'Singapore', severity: 'high', reason_code: 'missing_doc', reason_notes: 'F&F settlement missing final leave encashment calc and clearance sign-off.', status: 'open', created_by: 'emp-9', assigned_to: 'emp-8', created_at: '2026-03-15T10:00:00Z', resolved_at: null },
  { id: 'exc-9', entity_type: 'payroll_line', entity_id: 'pli-5', country: 'Singapore', severity: 'medium', reason_code: 'missing_doc', reason_notes: 'Payslip link missing for Bob Kumar March payroll.', status: 'open', created_by: 'emp-8', assigned_to: null, created_at: '2026-03-15T10:00:00Z', resolved_at: null },
  { id: 'exc-10', entity_type: 'claim', entity_id: 'CLM-001', country: 'Singapore', severity: 'low', reason_code: 'other', reason_notes: 'Business travel claim — confirm project code billing.', status: 'in_review', created_by: 'emp-8', assigned_to: 'emp-1', created_at: '2026-02-04T09:00:00Z', resolved_at: null },
];

// === NEW: Policy Rules ===
export const policyRules: PolicyRule[] = [
  { id: 'pr-1', policy_domain: 'claims', country: 'All', category: 'all', receipt_required: true, submission_window_days: 30, max_amount: null, currency: null, approval_chain: 'manager_only', payout_mode_default: null, notes: 'Default claim policy — receipt required, 30-day submission window', effective_from: '2025-01-01', effective_to: '2026-12-31', is_active: true },
  { id: 'pr-2', policy_domain: 'claims', country: 'All', category: 'reimbursement', receipt_required: true, submission_window_days: 30, max_amount: null, currency: null, approval_chain: 'manager_only', payout_mode_default: 'payroll', notes: 'Reimbursement claims — default to payroll payout', effective_from: '2025-01-01', effective_to: '2026-12-31', is_active: true },
  { id: 'pr-3', policy_domain: 'claims', country: 'All', category: 'client_entertainment', receipt_required: true, submission_window_days: 30, max_amount: 500, currency: 'SGD', approval_chain: 'manager_finance', payout_mode_default: null, notes: 'Client entertainment over SGD 500 requires finance approval', effective_from: '2025-01-01', effective_to: '2026-12-31', is_active: true },
  { id: 'pr-4', policy_domain: 'payroll', country: 'Singapore', category: 'ais', receipt_required: null, submission_window_days: null, max_amount: null, currency: null, approval_chain: 'hr_only', payout_mode_default: null, notes: 'Singapore payroll — AIS tracking enabled, submission required', effective_from: '2025-01-01', effective_to: '2026-12-31', is_active: true },
  { id: 'pr-5', policy_domain: 'vendor', country: 'All', category: 'all', receipt_required: null, submission_window_days: null, max_amount: null, currency: null, approval_chain: 'manager_only', payout_mode_default: null, notes: 'Vendor governance — require master vendor selection or exception for non-standard vendors', effective_from: '2025-01-01', effective_to: '2026-12-31', is_active: true },
];

// === NEW: Month-End Close ===
export const monthEndCloses: MonthEndClose[] = [
  { id: 'mec-1', country: 'Singapore', close_month: '2026-02', status: 'closed', owner_id: 'emp-8', notes: 'February close completed', created_at: '2026-03-01T10:00:00Z', updated_at: '2026-03-12T16:00:00Z' },
  { id: 'mec-2', country: 'Singapore', close_month: '2026-03', status: 'in_progress', owner_id: 'emp-8', notes: 'March close in progress', created_at: '2026-03-28T10:00:00Z', updated_at: '2026-03-28T10:00:00Z' },
  { id: 'mec-3', country: 'India', close_month: '2026-03', status: 'not_started', owner_id: 'emp-9', notes: '', created_at: '2026-03-28T10:00:00Z', updated_at: '2026-03-28T10:00:00Z' },
];

export const monthEndCloseTasks: MonthEndCloseTask[] = [
  { id: 'mect-1', month_end_close_id: 'mec-2', task_name: 'Verify all claims up to cutoff date are submitted', owner_role: 'Finance', owner_employee_id: 'emp-8', due_date: '2026-04-02', status: 'doing', evidence_link: '', notes: '' },
  { id: 'mect-2', month_end_close_id: 'mec-2', task_name: 'Resolve open claim exceptions (late/missing receipt)', owner_role: 'HR', owner_employee_id: 'emp-9', due_date: '2026-04-03', status: 'todo', evidence_link: '', notes: '2 open exceptions remaining' },
  { id: 'mect-3', month_end_close_id: 'mec-2', task_name: 'Validate manager-approved claims queue', owner_role: 'Finance', owner_employee_id: 'emp-8', due_date: '2026-04-03', status: 'done', evidence_link: 'https://drive.google.com/docs/march_claims_validated.xlsx', notes: '' },
  { id: 'mect-4', month_end_close_id: 'mec-2', task_name: 'Confirm reimbursement payout mode (payroll/ad-hoc)', owner_role: 'Finance', owner_employee_id: 'emp-8', due_date: '2026-04-04', status: 'todo', evidence_link: '', notes: '' },
  { id: 'mect-5', month_end_close_id: 'mec-2', task_name: 'Payroll run completeness check', owner_role: 'Finance', owner_employee_id: 'emp-8', due_date: '2026-04-05', status: 'todo', evidence_link: '', notes: 'Check for missing payslip links' },
  { id: 'mect-6', month_end_close_id: 'mec-2', task_name: 'AIS status updated (Prepared/Submitted/Accepted)', owner_role: 'Finance', owner_employee_id: 'emp-8', due_date: '2026-04-06', status: 'todo', evidence_link: '', notes: 'SG-specific' },
  { id: 'mect-7', month_end_close_id: 'mec-2', task_name: 'AIS reference captured', owner_role: 'Finance', owner_employee_id: 'emp-8', due_date: '2026-04-06', status: 'todo', evidence_link: '', notes: 'SG-specific' },
];

// === NEW: Drive Links ===
export const driveLinks: DriveLink[] = [
  { id: 'dl-1', link_type: 'employee_folder', employee_id: 'emp-1', related_entity_type: null, related_entity_id: null, title: 'Alice Chen — Employee Folder', drive_url: 'https://drive.google.com/drive/folders/abc123_alice', created_by: 'emp-9', created_at: '2023-03-15T10:00:00Z' },
  { id: 'dl-2', link_type: 'payslip', employee_id: 'emp-1', related_entity_type: 'payroll', related_entity_id: 'pli-1', title: 'Alice Chen — Feb 2026 Payslip', drive_url: 'https://drive.google.com/payslips/emp1-202602', created_by: 'emp-8', created_at: '2026-03-07T10:00:00Z' },
  { id: 'dl-3', link_type: 'contract', employee_id: 'emp-1', related_entity_type: null, related_entity_id: null, title: 'Employment Contract', drive_url: 'https://drive.google.com/docs/alice_contract.pdf', created_by: 'emp-9', created_at: '2023-03-10T10:00:00Z' },
  { id: 'dl-4', link_type: 'onboarding_doc', employee_id: 'emp-11', related_entity_type: 'onboarding', related_entity_id: 'obc-2', title: 'Priya Sharma — Offer Letter', drive_url: 'https://drive.google.com/docs/priya_offer.pdf', created_by: 'emp-9', created_at: '2026-03-10T10:00:00Z' },
  { id: 'dl-5', link_type: 'exit_doc', employee_id: 'emp-5', related_entity_type: 'exit', related_entity_id: 'exit-1', title: 'Eve Wong — Resignation Letter', drive_url: 'https://drive.google.com/docs/eve_resignation.pdf', created_by: 'emp-9', created_at: '2026-03-01T10:00:00Z' },
  { id: 'dl-6', link_type: 'insurance_doc', employee_id: 'emp-1', related_entity_type: null, related_entity_id: null, title: 'GHS Policy Document', drive_url: 'https://drive.google.com/docs/ghs_policy.pdf', created_by: 'emp-9', created_at: '2023-04-01T10:00:00Z' },
];

export const driveFolderTemplates: DriveFolderTemplate[] = [
  { id: 'dft-1', template_name: 'Standard Employee Folder', country: 'All', folder_structure_json: JSON.stringify(['01_Admin', '02_Payslips', '03_Insurance', '04_Onboarding', '05_Exit']) },
  { id: 'dft-2', template_name: 'SG Employee Folder (with AIS)', country: 'Singapore', folder_structure_json: JSON.stringify(['01_Admin', '02_Payslips', '03_Insurance', '04_Onboarding', '05_Exit', '06_AIS_Tax']) },
];
