import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import AuthScreen from "./pages/AuthScreen";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import SettingsPage from "./pages/Settings";
import ActivityTimeline from "./pages/ActivityTimeline";
import AIAssistant from "./pages/AIAssistant";
import Preferences from "./pages/Preferences";
import SupportCenter from "./pages/SupportCenter";

import DashboardLayout from "./Layouts/DashboardLayout";
import AuthLayout from "./Layouts/AuthLayout";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* AUTH */}
        <Route
          path="/"
          element={
            <AuthLayout>
              <AuthScreen />
            </AuthLayout>
          }
        />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* PROFILE */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Profile />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* ACTIVITY TIMELINE */}
        <Route
          path="/activity"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ActivityTimeline />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* AI ASSISTANT */}
        <Route
          path="/ai-assistant"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AIAssistant />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* PREFERENCES */}
        <Route
          path="/preferences"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Preferences />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* SUPPORT CENTER */}
        <Route
          path="/support"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <SupportCenter />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <Admin />
            </ProtectedRoute>
          }
        />

        {/* SETTINGS */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute adminOnly>
              <DashboardLayout>
                <SettingsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;