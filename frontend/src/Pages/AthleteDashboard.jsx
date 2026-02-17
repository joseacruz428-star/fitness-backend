import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import ProgressChart from '../components/ProgressChart'

const API = import.meta.env.VITE_API_URL

function AthleteDashboard({ onLogout }) {

  const [workouts, setWorkouts] = useState([])
  const [history, setHistory] = useState([])
  const [inputs, setInputs] = useState({})
  const token = localStorage.getItem('token')

  const handleChange = (key, field, value) => {
    setInputs(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: value }
    }))
  }

  const saveProgress = async (exerciseName, workoutId, key) => {

    const data = inputs[key]
    if (!data?.reps || !data?.weight) return alert('Completá reps y peso')

    try {

      const res = await fetch(`${API}/api/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          workoutId,
          exerciseName,
          sets: [
            {
              reps: Number(data.reps),
              weight: Number(data.weight),
              rpe: null
            }
          ],
          notes: '',
          completed: true
        })
      })

      const result = await res.json()

      if (!res.ok) return alert(result.message)

      alert('Progreso guardado 💪')

      const copy = { ...inputs }
      delete copy[key]
      setInputs(copy)

      const h = await fetch(`${API}/api/progress/my`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const historyData = await h.json()
      setHistory(Array.isArray(historyData) ? historyData : [])

    } catch (err) {
      console.error(err)
      alert('Error guardando progreso')
    }
  }

  useEffect(() => {

    if (!token) return

    const loadData = async () => {
      try {

        const res = await fetch(`${API}/api/workouts/student`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        const workoutData = res.ok ? await res.json() : []
        setWorkouts(Array.isArray(workoutData) ? workoutData : [])

        const h = await fetch(`${API}/api/progress/my`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        const historyData = await h.json()
        setHistory(Array.isArray(historyData) ? historyData : [])

      } catch (err) {
        console.error(err)
      }
    }

    loadData()

  }, [token])

  return (
    <>
      <Navbar />

      <div style={{ padding: 30, background: '#f5f6fa', minHeight: '100vh' }}>

        <button onClick={onLogout}>🔒 Salir</button>

        <h1>🏋️ Mis Rutinas</h1>

        {workouts.map(w => (
          <div key={w._id} style={{ background: 'white', padding: 15, marginBottom: 10 }}>
            <strong>{w.title}</strong>

            {w.exercises.map((e, idx) => (
              <div key={idx}>

                {e.name}

                <input
                  type="number"
                  placeholder="Reps"
                  value={inputs[`${w._id}-${idx}`]?.reps || ''}
                  onChange={e => handleChange(`${w._id}-${idx}`, 'reps', e.target.value)}
                />

                <input
                  type="number"
                  placeholder="Peso"
                  value={inputs[`${w._id}-${idx}`]?.weight || ''}
                  onChange={e => handleChange(`${w._id}-${idx}`, 'weight', e.target.value)}
                />

                <button onClick={() => saveProgress(e.name, w._id, `${w._id}-${idx}`)}>
                  Guardar
                </button>

              </div>
            ))}
          </div>
        ))}

        <h2>📊 Historial</h2>

        {history.map(h => (
          <div key={h._id} style={{ background: '#fff', padding: 10, marginBottom: 10 }}>

            <strong>{h.exerciseName}</strong>

            {h.sets?.map((s, i) => (
              <div key={i}>
                {s.reps} reps — {s.weight} kg
              </div>
            ))}

            <small>{new Date(h.createdAt).toLocaleDateString()}</small>

          </div>
        ))}

      </div>
    </>
  )
}

export default AthleteDashboard

