import { useNavigate } from 'react-router-dom'

function Navbar() {

  const navigate = useNavigate()
  const name = localStorage.getItem('name')
  const role = localStorage.getItem('role')

  const logout = () => {
    localStorage.clear()
    navigate('/')
  }

  return (

<div style={{
  background: '#0f172a',
  color: 'white',
  padding: '14px 20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'sticky',
  top: 0,
  zIndex: 1000
}}>

      <div>
        <strong>Fitness Platform</strong>
        <span style={{ marginLeft: 10, opacity: 0.7 }}>
          {role === 'coach' ? 'Coach' : 'Alumno'} — {name}
        </span>
      </div>

      <button
        onClick={logout}
        style={{
          background: '#e74c3c',
          border: 'none',
          color: 'white',
          padding: '6px 12px',
          borderRadius: 5,
          cursor: 'pointer'
        }}
      >
        Salir
      </button>
    </div>
  )
}

export default Navbar

