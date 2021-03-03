import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { clearMatch } from "./matchSlice";

type MatchWinnerProps = {
  playerName: string;
};

function MatchWinner({ playerName }: MatchWinnerProps) {
  const history = useHistory();
  const dispatch = useDispatch();
  return (
    <div className="text-center">
      <h1>We have a WINNER!</h1>
      <h1>[{playerName}] is the new EMPEROR!</h1>

      <button
        onClick={(e) => {
          e.preventDefault();
          dispatch(clearMatch());
          history.push("/");
        }}
        className="btn-primary"
      >
        Play again
      </button>
    </div>
  );
}

export default MatchWinner;
