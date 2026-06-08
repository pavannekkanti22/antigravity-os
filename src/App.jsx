import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import AuthScreen from "./pages/AuthScreen";

import DashboardLayout from "./Layouts/DashboardLayout";
import AuthLayout from "./Layouts/AuthLayout";

import ProtectedRoute from "./routes/ProtectedRoute";
import Admin from "./pages/Admin";

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
       <Route
  path="/admin"
  element={
    <ProtectedRoute adminOnly>
      <Admin />
    </ProtectedRoute>
  }
/>

      </Routes>

    </BrowserRouter>

  );
}

export default App;