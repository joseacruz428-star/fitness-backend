function StatCard({ title, value }) {

  return (
    <div style={{
      background: '#111',
      color: 'white',
      padding: 20,
      borderRadius: 12,
      minWidth: 160
    }}>
      <h3 style={{ margin: 0 }}>{title}</h3>
      <h1 style={{ margin: '10px 0' }}>{value}</h1>
    </div>
  )
}

export default StatCard
