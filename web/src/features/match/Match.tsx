import { FormEvent, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchRules, selectRules } from "../rules/rulesSlice";
import { selectMatch, fetchMatch, pushRound } from "./matchSlice";
import MatchWinner from "./MatchWinner";
import Score from "./Score";

export function Match() {
  const [currentSelection, setCurrentSelection] = useState("");
  const [playerOneMovement, setPlayerOneMovement] = useState("");

  const params = useParams<{ id: string }>();
  const dispatch = useDispatch();

  const match = useSelector(selectMatch);
  const rules = useSelector(selectRules);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = currentSelection ? currentSelection : rules[0].name;
    if (!playerOneMovement) {
      setPlayerOneMovement(value);
    } else {
      // And... Submit
      dispatch(
        pushRound({
          matchId: Number(params.id),
          playerOneMovement,
          playerTwoMovement: value,
        })
      );
      setPlayerOneMovement("");
    }

    setCurrentSelection("");
  };

  useEffect(() => {
    if (rules.length === 0) {
      dispatch(fetchRules());
    }
  }, [rules, dispatch]);

  useEffect(() => {
    if (!match.id) {
      dispatch(fetchMatch(Number(params.id)));
    }
  }, [match.id, params.id, dispatch]);

  return (
    <div className="card">
      {match.winner ? (
        <MatchWinner playerName={match.winner} />
      ) : (
        <>
          <h1>Round {match.currentRound}</h1>
          <h1>[{!playerOneMovement ? match.playerOne : match.playerTwo}]</h1>
          <div>
            <form onSubmit={handleSubmit}>
              <select
                value={currentSelection}
                onChange={(e) => setCurrentSelection(e.target.value)}
                className="input-txt"
              >
                {rules.map((rule) => (
                  <option key={rule.name} value={rule.name}>
                    {rule.name}
                  </option>
                ))}
              </select>
              <button className="btn-primary" type="submit">
                Submit
              </button>
            </form>
          </div>
          <div className="mt-4">
            <Score />
          </div>
        </>
      )}
    </div>
  );
}

export default Match;
