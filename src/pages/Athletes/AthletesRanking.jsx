import { useState, useEffect } from "react";
import { athletes } from "./Athletes";
import AthleteCard from "./AthleteCard";
import "./songbattle.css";

export default function SongBattleApp() {
  const [lists, setLists] = useState([]);
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);
  const [merged, setMerged] = useState([]);
  const [result, setResult] = useState(null);
  const [comparisons, setComparisons] = useState(0);

  useEffect(() => {
    const athletesWithIds = athletes.map((a) => ({
      ...a,
      id: crypto.randomUUID(),
    }));
    const initialLists = athletesWithIds.map((a) => [a]);
    setLists(initialLists);
  }, []);

  useEffect(() => {
    if (lists.length >= 2) {
      setLeft([...lists[0]]);
      setRight([...lists[1]]);
      setMerged([]);
    }
  }, [lists]);

  const totalComparisons = Math.ceil(athletes.length * Math.log2(athletes.length));
  const progress = Math.min(100, Math.round((comparisons / totalComparisons) * 100));

  function choose(athlete) {
    setComparisons((c) => c + 1);

    const newMerged = [...merged, athlete];

    if (athlete === left[0]) {
      setLeft(left.slice(1));
    } else {
      setRight(right.slice(1));
    }

    const leftEmpty = athlete === left[0] ? left.slice(1).length === 0 : left.length === 0;
    const rightEmpty = athlete === right[0] ? right.slice(1).length === 0 : right.length === 0;

    if (leftEmpty || rightEmpty) {
      const remaining = [
        ...(athlete === left[0] ? left.slice(1) : left),
        ...(athlete === right[0] ? right.slice(1) : right),
      ];
      const completed = [...newMerged, ...remaining];

      const newLists = [...lists.slice(2), completed];

      if (newLists.length === 1) {
        setResult(newLists[0]);
        return;
      }
      setLists(newLists);
    }

    setMerged(newMerged);
  }

  function generateShareText(results) {
    const top = results.slice(0, 10);
    let text = `My NY Athlete Rankings

${blocks}

Top Athletes:
`;
    top.forEach((athlete, i) => {
      text += `${i + 1}. ${athlete.name} — ${athlete.team}\n`;
    });

    text += `

Rank yours here:
https://richimbro.com`;

    return text;
  }

  // Copy results to clipboard
  function copyResults() {
    if (!result) return;
    const text = generateShareText(result);
    navigator.clipboard.writeText(text);
  }

  function shareResults() {
    if (!result) return;

    const text = generateShareText(result);

    if (navigator.share) {
      navigator
        .share({
          title: "My NY Athlete Rankings",
          text: text,
          url: "https://richimbro.com",
        })
        .catch(() => {
          copyResults();
        });
    } else {
      copyResults();
    }
  }

  if (result) {
    return (
      <div className="songbattle-page">
        <div className="songbattle-title">Your Ranked NY Athletes</div>
        <div className="page-description">
          Congratulations! Here’s your personal ranking of the best NY athletes.
          You can copy or share your results with Rich.
        </div>

        <div className="leaderboard-list">
          {result.map((athlete, i) => (
            <div className="leaderboard-item" key={athlete.id}>
              <span className="leaderboard-rank">{i + 1}</span>
              <span className="leaderboard-name">{athlete.name}</span>
              <span className="leaderboard-team">{athlete.team}</span>
            </div>
          ))}
        </div>

        <div className="share-buttons">
          <button className="share-button" onClick={shareResults}>
            Share Results
          </button>
        </div>
      </div>
    );
  }

  // Battle view
  if (!left.length || !right.length) return null;

  return (
    <div className="songbattle-page">
      <div className="songbattle-title">Which NY athlete is better?</div>
      <div className="page-description">
        Pick between two NY athletes to build your personal top ranking. Base it off of not "who is more athletic", but who is the better athlete in thier sport. Let me know any athletes I forgot!
      </div>

      <div className="ranking-progress">
        <div className="progress-header">
          Ranking Progress
          <span>{progress}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="battle-area">
        <AthleteCard athlete={left[0]} onSelect={choose} />
        <AthleteCard athlete={right[0]} onSelect={choose} />
      </div>
    </div>
  );
}