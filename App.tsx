
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './components/AdminDashboard';
import ClientManagement from './components/ClientManagement';
import ScheduleManagement from './components/ScheduleManagement';
import FinancialManagement from './components/FinancialManagement';
import KanbanBoard from './components/KanbanBoard';
import RetentionTool from './components/RetentionTool';
import SessionReportManagement from './components/SessionReportManagement';
import { Client, Appointment, FinancialRecord, KanbanTask, SessionReport, GlobalSettings } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('karina_auth') === 'true';
  });

  const [settings, setSettings] = useState<GlobalSettings>(() => {
    const saved = localStorage.getItem('karina_settings');
    return saved ? JSON.parse(saved) : { defaultPrice: 200, defaultDuration: 60 };
  });

  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('karina_clients');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Ana Souza', address: 'Copacabana, RJ', phone: '2199999999', email: 'ana@email.com', status: 'active', treatmentStage: 'In Treatment', lastSessionDate: '2023-11-01' },
      { id: '2', name: 'Bruno Mendes', address: 'Ipanema, RJ', phone: '2198888888', email: 'bruno@email.com', status: 'active', treatmentStage: 'Evaluation', lastSessionDate: '2023-10-15' },
    ];
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('karina_appointments');
    if (saved) return JSON.parse(saved);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    return [
      { id: 'app-1', clientId: '1', date: tomorrowStr, time: '10:00', type: 'Clinical', status: 'scheduled', meetLink: 'https://meet.google.com/karina-consulta', price: 200, duration: 60 },
    ];
  });

  const [sessionReports, setSessionReports] = useState<SessionReport[]>(() => {
    const saved = localStorage.getItem('karina_reports');
    return saved ? JSON.parse(saved) : [];
  });

  const [finances, setFinances] = useState<FinancialRecord[]>(() => {
    const saved = localStorage.getItem('karina_finances');
    return saved ? JSON.parse(saved) : [];
  });

  const [kanbanTasks, setKanbanTasks] = useState<KanbanTask[]>(() => {
    const saved = localStorage.getItem('karina_kanban');
    return saved ? JSON.parse(saved) : [
      { id: 'k1', title: 'Ajuste de Plano Alimentar - Ana', status: 'doing' },
      { id: 'k2', title: 'Análise de Exames - Bruno', status: 'todo' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('karina_clients', JSON.stringify(clients));
    localStorage.setItem('karina_appointments', JSON.stringify(appointments));
    localStorage.setItem('karina_reports', JSON.stringify(sessionReports));
    localStorage.setItem('karina_finances', JSON.stringify(finances));
    localStorage.setItem('karina_kanban', JSON.stringify(kanbanTasks));
    localStorage.setItem('karina_settings', JSON.stringify(settings));
  }, [clients, appointments, sessionReports, finances, kanbanTasks, settings]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('karina_auth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('karina_auth');
  };

  const registerNewBooking = (clientData: { name: string, email: string, phone: string }, appointmentData: { date: string, time: string }) => {
    let clientId = clients.find(c => c.email.toLowerCase() === clientData.email.toLowerCase())?.id;
    if (!clientId) {
      clientId = Date.now().toString();
      const newClient: Client = { id: clientId, name: clientData.name, email: clientData.email, phone: clientData.phone, address: 'Pendente', status: 'pending', treatmentStage: 'First Contact' };
      setClients(prev => [...prev, newClient]);
    }

    const newAppointment: Appointment = {
      id: `app-${Date.now()}`,
      clientId,
      date: appointmentData.date,
      time: appointmentData.time,
      type: 'Clinical',
      status: 'scheduled',
      meetLink: `https://meet.google.com/karina-${Math.random().toString(36).substring(7)}`,
      price: settings.defaultPrice,
      duration: settings.defaultDuration
    };
    
    setAppointments(prev => [...prev, newAppointment]);
    setFinances(prev => [...prev, { id: `f-${Date.now()}`, description: `Agendamento Online - ${clientData.name}`, amount: settings.defaultPrice, type: 'income', date: appointmentData.date, category: 'Consulta' }]);
    return newAppointment;
  };

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage appointments={appointments} onBookingComplete={registerNewBooking} settings={settings} />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        {isAuthenticated ? (
          <Route path="/admin" element={<AdminLayout onLogout={handleLogout} />}>
            <Route index element={<AdminDashboard clients={clients} appointments={appointments} finances={finances} />} />
            <Route path="clients" element={<ClientManagement clients={clients} setClients={setClients} />} />
            <Route path="schedule" element={<ScheduleManagement appointments={appointments} setAppointments={setAppointments} clients={clients} setFinances={setFinances} settings={settings} setSettings={setSettings} />} />
            <Route path="reports" element={<SessionReportManagement appointments={appointments} clients={clients} reports={sessionReports} setReports={setSessionReports} />} />
            <Route path="finance" element={<FinancialManagement finances={finances} setFinances={setFinances} />} />
            <Route path="kanban" element={<KanbanBoard tasks={kanbanTasks} setTasks={setKanbanTasks} />} />
            <Route path="retention" element={<RetentionTool clients={clients} />} />
          </Route>
        ) : (
          <Route path="/admin/*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </HashRouter>
  );
};

export default App;
