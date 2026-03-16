export default function AthleteCard({ athlete, onSelect }) {
  return (
    <div className="athlete-card" onClick={() => onSelect(athlete)}>
      <div className="athlete-name">{athlete.name}</div>
      <div className="athlete-team">{athlete.team}</div>
    </div>
  );
}