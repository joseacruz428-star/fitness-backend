import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/login'
import Dashboard from './pages/dashboard'
import AthleteDashboard from './pages/athletedashboard'

function App() {
  // Estado global de sesión
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [role, setRole] = useState(localStorage.getItem('role'))

  // Función para login
  const handleLogin = (newToken, newRole) => {
    localStorage.setItem('token', newToken)
    localStorage.setItem('role', newRole)
    setToken(newToken)
    setRole(newRole)
  }

  // Función para logout
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    setToken(null)
    setRole(null)
  }

  return (
    <Routes>

      {/* LOGIN */}
      <Route
        path="/"
        element={
          token
            ? role === 'coach'
              ? <Navigate to="/coach" />
              : <Navigate to="/student" />
            : <Login onLogin={handleLogin} />
        }
      />

      {/* DASHBOARD COACH */}
      <Route
        path="/coach"
        element={
          token && role === 'coach'
            ? <Dashboard onLogout={handleLogout} />
            : <Navigate to="/" />
        }
      />

      {/* DASHBOARD ALUMNO */}
      <Route
        path="/student"
        element={
          token && role === 'student'
            ? <AthleteDashboard onLogout={handleLogout} />
            : <Navigate to="/" />
        }
      />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  )
}

export default App

