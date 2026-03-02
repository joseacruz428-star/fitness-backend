function Sidebar({ setView }) {

  return (
    <div style={{
      background: '#111',
      color: 'white',
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }}>

      <h2 style={{ marginBottom: 20 }}>🏋 FIT Platform</h2>

      <button style={btnStyle} onClick={() => setView('dashboard')}>
        Dashboard
      </button>

      <button style={btnStyle} onClick={() => setView('students')}>
        Alumnos
      </button>

      <button style={btnStyle} onClick={() => setView('create-workout')}>
        Crear Rutina
      </button>

    </div>
  )
}

const btnStyle = {
  padding: '12px',
  borderRadius: 8,
  border: 'none',
  cursor: 'pointer',
  fontSize: 16
}

export default Sidebar

