import { useNavigate } from 'react-router-dom' 
import { useState } from 'react'

const API = import.meta.env.VITE_API_URL

function Login({ onLogin }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const login = async () => {
    try {
      const res = await  fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (data.token) {
        // Avisamos a App.jsx
        onLogin(data.token, data.role)

        // Redirigir según rol
        if (data.role === 'coach') navigate('/coach')
        else navigate('/student')
      } else {
        alert(data.message || 'Login incorrecto')
      }
    } catch (err) {
      alert('Error de conexión')
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Login Fitness Platform</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={login}>Ingresar</button>
    </div>
  )
}

export default Login

