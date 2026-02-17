 import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import CreateWorkout from './CreateWorkout';
import Navbar from '../components/Navbar';
import ProgressChart from '../components/ProgressChart';

const API = import.meta.env.VITE_API_URL

console.log(import.meta.env.VITE_API_URL)

function Dashboard({ onLogout }) {
  const [view, setView] = useState('dashboard');
  const [workouts, setWorkouts] = useState([]);
  const [progress, setProgress] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const token = localStorage.getItem('token');

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentProgress, setStudentProgress] = useState([]);

  const fetchStudents = async () => {
    const res = await  fetch(`${API}/api/student`, {
    headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setStudents(data);
  };

  const createStudent = async () => {
    const res = await  fetch(`${API}/api/students/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: newEmail,
        email: newEmail,
        password: newPassword,
      }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message || 'Error');

    alert('Alumno creado');
    setNewEmail('');
    setNewPassword('');
    fetchStudents();
  };

const loadStudentProgress = async (student) => {
  setSelectedStudent(student);

  const res = await  fetch(`${API}/api/progress/coach`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();

  const filtered = data.filter(p => p.user?._id === student._id);

  setStudentProgress(filtered);
};

useEffect(() => {
  if (!token) return setLoading(false);

  const loadData = async () => {
    try {
      // 🔹 1️⃣ TRAER RUTINAS DEL COACH
      const workoutsRes = await  fetch(`${API}/api/workouts/coach`, {
      headers: { Authorization: `Bearer ${token}` },
      });

      const workoutsData = await workoutsRes.json();
      setWorkouts(Array.isArray(workoutsData) ? workoutsData : []);

      // 🔹 2️⃣ TRAER PROGRESOS
      const progressRes = await  fetch(`${API}/api/progress/coach`, {
      headers: { Authorization: `Bearer ${token}` },
      });

      const progressData = await progressRes.json();
      setProgress(Array.isArray(progressData) ? progressData : []);

      // 🔹 3️⃣ TRAER ALUMNOS
      await fetchStudents();

      setLoading(false);

    } catch (error) {
      console.error("Error cargando dashboard:", error);
      setLoading(false);
    }
  };

  loadData();
}, []);

  if (loading) return <h2>Cargando panel...</h2>;
  if (!token) return <h2>No autorizado</h2>;

const totalWeight = progress.reduce((total, p) => {
  const sumSets = p.sets.reduce((acc, set) => {
    return acc + (set.weight * set.reps);
  }, 0);
  return total + sumSets;
}, 0);

const totalPRs = progress.filter(p => p.isPR).length;

const exerciseCount = {};

progress.forEach(p => {
  exerciseCount[p.exerciseName] = (exerciseCount[p.exerciseName] || 0) + 1;
});

const mostTrainedExercise = Object.keys(exerciseCount).reduce(
  (a, b) => exerciseCount[a] > exerciseCount[b] ? a : b,
  "-"
);

const studentCount = {};

progress.forEach(p => {
  const email = p.user?.email;
  if (email) {
    studentCount[email] = (studentCount[email] || 0) + 1;
  }
});

const mostActiveStudent = Object.keys(studentCount).reduce(
  (a, b) => studentCount[a] > studentCount[b] ? a : b,
  "-"
);

const getExerciseEvolution = (exerciseName) => {
  const filtered = studentProgress
    .filter(p => p.exerciseName === exerciseName)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const history = filtered.map(p => {
    let bestSet = p.sets.reduce((best, current) => {
      return current.weight > best.weight ? current : best;
    });

    const estimated1RM = bestSet.weight * (1 + bestSet.reps / 30);

    return {
      date: new Date(p.createdAt).toLocaleDateString(),
      weight: bestSet.weight,
      oneRM: Math.round(estimated1RM)
    };
  });

  return history;
};

const checkPlateau = (history) => {
  if (history.length < 4) return false;

  const oneRMValues = history.map(h => h.oneRM);

  const previousMax = Math.max(...oneRMValues.slice(0, -3));
  const lastThree = oneRMValues.slice(-3);

  const isImproving = lastThree.some(val => val > previousMax);

  return !isImproving;
};

const predictNextPR = (history) => {
  if (history.length < 3) return null;

  const lastThree = history.slice(-3);
  const diffs = [];

  for (let i = 1; i < lastThree.length; i++) {
    diffs.push(lastThree[i].oneRM - lastThree[i - 1].oneRM);
  }

  const avgIncrease = diffs.reduce((a, b) => a + b, 0) / diffs.length;

  const lastValue = lastThree[lastThree.length - 1].oneRM;

  const prediction = Math.round(lastValue + avgIncrease);

  if (avgIncrease <= 0) return null;

  return prediction;
};



return (
    <>
      <Navbar />
<div style={{
  display: 'flex',
  flexDirection: window.innerWidth < 768 ? 'column' : 'row',
  minHeight: '100vh'
}}>

        <Sidebar setView={setView} />

<div
  style={{
    flex: 1,
    padding: window.innerWidth < 768 ? 15 : 30,
    background: '#f4f6f9',
    display: 'flex',
    justifyContent: 'center'
  }}
>
  <div
    style={{
      width: '100%',
      maxWidth: 1100
    }}
  >

          {/* BOTÓN SALIR */}
          <button
            onClick={onLogout}
            style={{
              marginBottom: 20,
              padding: 8,
              borderRadius: 6,
              border: 'none',
              background: '#e74c3c',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            🔒 Salir
          </button>

          {/* DASHBOARD PRINCIPAL */}
          {view === 'dashboard' && (
            <>
              <h1>🏋 Panel Entrenador</h1>
<div
  style={{
    display: 'grid',
    gridTemplateColumns: window.innerWidth < 768
      ? '1fr'
      : 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 20,
    marginTop: 20
  }}
>
  <StatCard title="Rutinas" value={workouts.length} />
  <StatCard title="Registros" value={progress.length} />
  <StatCard title="Alumnos" value={students.length} />
  <StatCard title="PRs Totales" value={totalPRs} />
  <StatCard title="Kg Movidos" value={totalWeight} />
</div>

<div style={{ marginTop: 20 }}>
  <p><strong>🏋 Ejercicio más trabajado:</strong> {mostTrainedExercise}</p>
  <p><strong>👤 Alumno más activo:</strong> {mostActiveStudent}</p>
</div>

              <h2 style={{ marginTop: 30 }}>📈 Progreso de alumnos</h2>
              {progress.length === 0 && <p>No hay progreso aún</p>}

{progress.map(p => (
  <div key={p._id} style={{ border: '1px solid gray', margin: '10px' }}>
    
    <p><strong>Alumno:</strong> {p.user?.email}</p>
    <p><strong>Ejercicio:</strong> {p.exerciseName}</p>
    <p><strong>Fecha:</strong> {new Date(p.createdAt).toLocaleDateString()}</p>

    <div>
      <strong>Series:</strong>
      {p.sets.map((set, index) => (
        <div key={index}>
          Reps: {set.reps} | Peso: {set.weight} kg
        </div>
      ))}
    </div>

    {p.isPR && <p style={{color:'gold'}}>🏆 PR!</p>}

  </div>
))}

            </>
          )}

          {/* SECCIÓN ALUMNOS */}
          {view === 'students' && (
            <>
              <h2>👥 Alumnos</h2>
              {students.map((s) => (
                <div
                  key={s._id}
                  style={{ background: 'white', padding: 15, marginBottom: 10, borderRadius: 8 }}
                >
                  <strong>{s.email}</strong>
                  <div>Rol: {s.role}</div>
                  <button
                    onClick={() => loadStudentProgress(s)}
                    style={{
                      marginTop: 8,
                      padding: 6,
                      borderRadius: 6,
                      border: 'none',
                      background: '#3498db',
                      color: 'white',
                      cursor: 'pointer',
                    }}
                  >
                    Ver progreso
                  </button>
                </div>
              ))}

              {selectedStudent && (
                <div style={{ marginTop: 40 }}>
                  <h2>📊 Progreso de {selectedStudent.name || selectedStudent.email}</h2>
                  {studentProgress.length === 0 && <p>Este alumno aún no tiene registros</p>}
                  {studentProgress.map((p) => (
                    <div
                      key={p._id}
  style={{
  background: 'white',
  padding: 16,
  marginBottom: 15,
  borderRadius: 12,
  boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
}}
                  >
                      <strong>{p.exerciseName}</strong>
                      <br />

{p.sets.map((set, index) => (
  <div key={index}>
    {set.reps} reps — {set.weight} kg
  </div>
))}

                      <br />
<small>{new Date(p.createdAt).toLocaleDateString()}</small>

                    </div>
                  ))}

                  <h3 style={{ marginTop: 30 }}>📈 Gráficos</h3>

{[...new Set(studentProgress.map((p) => p.exerciseName))].map((ex) => {
  const history = getExerciseEvolution(ex);
  const isPlateau = checkPlateau(history);
  const nextPR = predictNextPR(history);

  return (
    <div key={ex}>
      <ProgressChart 
        history={history} 
        exerciseName={ex} 
      />

      {isPlateau && (
        <div style={{ color: 'red', marginTop: 8 }}>
          ⚠️ Posible estancamiento detectado en {ex}
        </div>
      )}

      {nextPR && (
        <div style={{ color: 'green', marginTop: 8 }}>
          📈 Próximo PR estimado: {nextPR} kg
        </div>
      )}
    </div>
  );
})}

                </div>
              )}
            </>
          )}

          {view === 'create-workout' && <CreateWorkout />}
        </div>
      </div>
</div>
    </>
  );
}

export default Dashboard;
