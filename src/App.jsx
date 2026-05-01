// src/App.jsx - Main App with routing
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import PatientDetail from './pages/PatientDetail';
import AddPatient from './pages/AddPatient';
import AIPredict from './pages/AIPredict';
import Appointments from './pages/Appointments';
import Reports from './pages/Reports';
import ActivityLogs from './pages/ActivityLogs';
import QuantumEngine from './pages/QuantumEngine';
import { Toaster } from 'react-hot-toast';

function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: '#1a2332', color: '#e2e8f0', border: '1px solid rgba(99,179,237,0.2)' },
              success: { iconTheme: { primary: '#48bb78', secondary: '#1a2332' } },
              error: { iconTheme: { primary: '#fc8181', secondary: '#1a2332' } }
            }}
          />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard"      element={<Dashboard />} />
              <Route path="patients"       element={<Patients />} />
              <Route path="patients/add"   element={<AddPatient />} />
              <Route path="patients/:id"   element={<PatientDetail />} />
              <Route path="ai-predict"     element={<AIPredict />} />
              <Route path="appointments"   element={<Appointments />} />
              <Route path="reports"        element={<Reports />} />
              <Route path="logs"           element={<ActivityLogs />} />
              <Route path="quantum"        element={<QuantumEngine />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}
