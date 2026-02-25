import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_API_URL

function CreateWorkout() {

  const [students, setStudents] = useState([])
 
 const [studentId, setStudentId] = useState('')
 
 const [title, setTitle] = useState('')
 const [exercise, setExercise] = useState({
    name: '',
    sets: '',
    reps: '',
    type: 'strength'
  })

  const [exercises, setExercises] = useState([])

  const token = localStorage.getItem('token')

  useEffect(() => {
    fetch(`${API}/api/student`, {
        headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setStudents(data))
  }, [])

  const addExercise = () => {
    if (!exercise.name) return
    setExercises([...exercises, exercise])
    setExercise({ name: '', sets: '', reps: '', type: 'strength' })
  }

const saveWorkout = async () => {

  if (!title || exercises.length === 0) {
    alert('Falta nombre de rutina o ejercicios')
    return
  }

  const res = await  fetch(`${API}/api/workouts`, {
      method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
     body: JSON.stringify({
     title,
     exercises,
     student: studentId
     })

  })

  const data = await res.json()

  if (!res.ok) {
    alert(data.message || 'Error creando rutina')
    return
  }

  alert('Rutina creada correctamente')

  setTitle('')
  setExercises([])
  setStudentId('')
  
}


  return (
    <div style={{ padding: 20 }}>
      <h2>Crear Rutina</h2>

      <input
        placeholder="Nombre de la rutina"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <br /><br />

      <select value={studentId} onChange={e => setStudentId(e.target.value)}>
        <option value="">Seleccionar alumno</option>
        {students.map(s => (
          <option key={s._id} value={s._id}>
            {s.name || s.email}
          </option>
        ))}
      </select>

      <h3>Ejercicio</h3>

      <input
        placeholder="Nombre"
        value={exercise.name}
        onChange={e => setExercise({ ...exercise, name: e.target.value })}
      />

      <input
        placeholder="Series"
        value={exercise.sets}
        onChange={e => setExercise({ ...exercise, sets: e.target.value })}
      />

      <input
        placeholder="Reps"
        value={exercise.reps}
        onChange={e => setExercise({ ...exercise, reps: e.target.value })}
      />

      <select
        value={exercise.type}
        onChange={e => setExercise({ ...exercise, type: e.target.value })}
      >
        <option value="strength">Fuerza</option>
        <option value="cardio">Cardio</option>
        <option value="wod">WOD</option>
      </select>

      <br /><br />

      <button onClick={addExercise}>Agregar ejercicio</button>

      <h3>Lista ejercicios</h3>

      {exercises.map((ex, i) => (
        <div key={i}>
          {ex.name} — {ex.sets}x{ex.reps}
        </div>
      ))}

      <br />

      <button onClick={saveWorkout}>
        Guardar Rutina
      </button>
    </div>
  )
}

export default CreateWorkout
