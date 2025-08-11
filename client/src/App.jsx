import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfileForm from "./pages/profileForm";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import RoleBasedRoute from "./components/RoleBasedRoute";

import Customers from "./pages/Customers";
import DailyEntry from "./pages/DailyEntry";
import MonthlyHishob from "./pages/MonthlyHishob";
import WarehouseDashboard from "./pages/WarehouseDashboard";

import OverallAnalysis from "./pages/OverallAnalysis";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin-dashboard"
          element={
            <RoleBasedRoute allowedRole="admin">
              <AdminDashboard />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <PrivateRoute>
              <Customers />
            </PrivateRoute>
          }
        />
        <Route
          path="/daily-entry"
          element={
            <PrivateRoute>
              <DailyEntry />
            </PrivateRoute>
          }
        />
        <Route
          path="/monthly-hishob"
          element={
            <PrivateRoute>
              <MonthlyHishob />
            </PrivateRoute>
          }
        />
        <Route
          path="/warehouse-report"
          element={
            <PrivateRoute>
              <WarehouseDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/overall-analysis"
          element={
            <PrivateRoute>
              <OverallAnalysis />
            </PrivateRoute>
          }
        />

        <Route
          path="/user-dashboard"
          element={
            <RoleBasedRoute allowedRole="user">
              <UserDashboard />
            </RoleBasedRoute>
          }
        />
        <Route path="/profile" element={<ProfileForm />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
