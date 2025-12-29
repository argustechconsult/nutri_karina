
export interface Client {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  lastSessionDate?: string;
  treatmentStage: 'First Contact' | 'Evaluation' | 'In Treatment' | 'Maintenance';
}

export interface Appointment {
  id: string;
  clientId: string;
  date: string;
  time: string;
  type: 'Clinical' | 'Behavioral';
  status: 'scheduled' | 'completed' | 'cancelled';
  meetLink?: string;
  price: number;
  duration: number; // em minutos
}

export interface GlobalSettings {
  defaultPrice: number;
  defaultDuration: number;
}

export interface SessionReport {
  id: string;
  appointmentId: string;
  clientId: string;
  date: string;
  content: string;
  observations: string;
  evolution: string;
  conduct: string;
  // Campos novos de Nutrição
  healthHistory: string;
  eatingHabits: string;
  anthropometrics: string;
  patientGoals: string;
}

export interface FinancialRecord {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  category: string;
}

export interface KanbanTask {
  id: string;
  title: string;
  clientId?: string;
  status: 'todo' | 'doing' | 'done';
}

export enum AppRoute {
  LANDING = '/',
  LOGIN = '/login',
  ADMIN_DASHBOARD = '/admin',
  ADMIN_CLIENTS = '/admin/clients',
  ADMIN_SCHEDULE = '/admin/schedule',
  ADMIN_FINANCE = '/admin/finance',
  ADMIN_KANBAN = '/admin/kanban',
  ADMIN_RETENTION = '/admin/retention',
  ADMIN_REPORTS = '/admin/reports',
  ADMIN_CALCULATORS = '/admin/calculators'
}
