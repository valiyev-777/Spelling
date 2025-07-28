// src/App.tsx
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import RequireAuth from "./components/RequireAuth";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";
import Practice from "./pages/Practice";
import Confirm from "./pages/Confirm";
// import Practice from "./pages/Practice";
// import Leaderboard from "./pages/Leaderboard";

function App() {
  return (
    <Routes>
      {/* Layout includes Navbar + nested routes */}
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route index element={<Landing />} />
        <Route path="sign-in" element={<Login />} />
        <Route path="sign-up" element={<Register />} />
        <Route path="/confirm" element={<Confirm />} />

        {/* Protected routes */}
        <Route
          path="dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route
          path="practice"
          element={
            <RequireAuth>
              <Practice />
            </RequireAuth>
          }
        />
        <Route path="leaderboard" element={<Leaderboard />} />
      </Route>
    </Routes>
  );
}

export default App;
