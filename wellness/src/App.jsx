import { Navigate, Routes, Route } from 'react-router-dom';
import { useAuth } from '@shared/AuthContext';
import WellnessLayout from './components/WellnessLayout';
import PwaGate from './pages/PwaGate';
import Dashboard from './pages/Dashboard';
import TeaJournal from './pages/TeaJournal';
import AICoach from './pages/AICoach';
import DrinkSuggestion from './pages/DrinkSuggestion';
import WorkoutPlanner from './pages/WorkoutPlanner';
import Challenges from './pages/Challenges';
import FamilyHub from './pages/FamilyHub';
import Reports from './pages/Reports';
import DrugCheck from './pages/DrugCheck';
import ProPurchase from './pages/ProPurchase';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import ProGuard from './components/ProGuard';

function AppRoutes() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<PwaGate />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route element={<WellnessLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/journal" element={<TeaJournal />} />
          <Route path="/coach" element={<ProGuard><AICoach /></ProGuard>} />
          <Route path="/suggest" element={<DrinkSuggestion />} />
          <Route path="/workout" element={<ProGuard><WorkoutPlanner /></ProGuard>} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/family" element={<ProGuard><FamilyHub /></ProGuard>} />
          <Route path="/reports" element={<ProGuard><Reports /></ProGuard>} />
          <Route path="/drug-check" element={<ProGuard><DrugCheck /></ProGuard>} />
          <Route path="/pro" element={<ProPurchase />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default function App() {
  return <AppRoutes />;
}
