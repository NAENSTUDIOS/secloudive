import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { AdminResourcesPage } from './pages/AdminResourcesPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { HomePage } from './pages/HomePage';
import { Login } from './pages/Login';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProfilePage } from './pages/ProfilePage';
import { LearningPathsPage, SecurityCenterPage } from './pages/SecurityCenterPage';
import { Register } from './pages/Register';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { AcademyDashboardPage } from './pages/AcademyDashboardPage';
import { TrackPathPage } from './pages/TrackPathPage';
import { ModulePage } from './pages/ModulePage';
import { LabPage } from './pages/LabPage';
import { LivePage, PrivacyPage, ResourcesPage, ScenarioPlayerPage, ScenariosPage } from './pages/AcademyLibraryPages';

export default function App() {
  return <BrowserRouter><AuthProvider><Routes>
    <Route element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Register />} />
      <Route path="forgot-password" element={<AuthPage mode="forgot" />} />
      <Route path="reset-password" element={<ResetPasswordPage />} />
      <Route path="privacy" element={<PrivacyPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="academy" element={<AcademyDashboardPage />} />
        <Route path="paths/:track" element={<TrackPathPage />} />
        <Route path="modules/:moduleId" element={<ModulePage />} />
        <Route path="labs/:labId" element={<LabPage />} />
        <Route path="scenarios" element={<ScenariosPage />} />
        <Route path="scenarios/:scenarioId" element={<ScenarioPlayerPage />} />
        <Route path="live" element={<LivePage />} />
        <Route path="resources" element={<ResourcesPage />} />
        <Route path="security" element={<SecurityCenterPage />} />
        <Route path="learning" element={<LearningPathsPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      <Route element={<ProtectedRoute adminOnly />}>
        <Route path="admin/users" element={<AdminUsersPage />} />
        <Route path="admin/resources" element={<AdminResourcesPage />} />
      </Route>
      <Route path="404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Route>
  </Routes></AuthProvider></BrowserRouter>;
}
