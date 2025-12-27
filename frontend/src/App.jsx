import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Layout from "./components/Layout.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import LiveDetection from "./pages/LiveDetection.jsx"
import Rewards from "./pages/Rewards.jsx"
import History from "./pages/History.jsx"
import Login from "./pages/Login.jsx"
import Signup from "./pages/Signup.jsx"
import Account from "./pages/Account.jsx"
import { AuthProvider } from "./auth/AuthContext.jsx"
import ProtectedRoute from "./auth/ProtectedRoute.jsx"

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/live"
              element={
                <ProtectedRoute>
                  <LiveDetection />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rewards"
              element={
                <ProtectedRoute>
                  <Rewards />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
