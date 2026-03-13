export default function StatCard({ label, value, help }) {
  return (
    <div className="card stat-card">
      <p className="eyebrow">{label}</p>
      <h3>{value}</h3>
      <small>{help}</small>
    </div>
  );
}
