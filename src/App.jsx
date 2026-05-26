import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthScreen from "./pages/AuthScreen";
import Dashboard from "./pages/Dashboard";

import AuthLayout from "./Layouts/AuthLayout";
import DashboardLayout from "./Layouts/DashboardLayout";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={
            <AuthLayout>
              <AuthScreen />
            </AuthLayout>
          }
        />

        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;