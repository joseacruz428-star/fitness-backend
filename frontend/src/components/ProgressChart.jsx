import { 
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
)

function ProgressChart({ history, exerciseName }) {

  if (!history || history.length === 0) return null

const data = {
  labels: history.map(p => p.date),
  datasets: [
    {
      label: 'Peso máximo (kg)',
      data: history.map(p => p.weight),
      borderColor: '#3498db',
      tension: 0.3
    },
    {
      label: '1RM estimado (kg)',
      data: history.map(p => p.oneRM),
      borderColor: '#2ecc71',
      tension: 0.3
    }
  ]
};

return (
  <div
    style={{
      marginTop: 20,
      background: 'white',
      padding: 20,
      borderRadius: 12,
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
    }}
  >
    <h4 style={{ marginBottom: 15 }}>
      📈 Progreso en {exerciseName}
    </h4>
    <Line data={data} />
  </div>
)
}

export default ProgressChart

