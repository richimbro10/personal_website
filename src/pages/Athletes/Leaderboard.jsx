export default function Leaderboard({ songs }) {

  const ranked = [...songs]
    .sort((a,b) => b.score - a.score)
    .slice(0,20);

  return (
    <div className="songbattle-leaderboard">

      <div className="leaderboard-title">
        Top Songs
      </div>

      <div className="leaderboard-list">

        {ranked.map((song,i)=>(
          <div className="leaderboard-item" key={song.id}>

            <span className="leaderboard-rank">
              {i+1}
            </span>

            <span className="leaderboard-song">
              {song.title}
            </span>

            <span className="leaderboard-score">
              {Math.round(song.score)}
            </span>

          </div>
        ))}

      </div>

    </div>
  );
}