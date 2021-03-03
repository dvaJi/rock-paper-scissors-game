import { useSelector } from "react-redux";
import { selectMatch, selectRounds } from "./matchSlice";

export function Score() {
  const rounds = useSelector(selectRounds);
  const match = useSelector(selectMatch);

  const getPlayerName = (winnerId?: string) => {
    if (winnerId === "PLAYER_ONE") {
      return match.playerOne;
    } else {
      return match.playerTwo;
    }
  };

  return (
    <div>
      <h1>Score</h1>
      <div>
        <table className="text-left w-full border-collapse">
          <thead>
            <tr>
              <th className="py-4 px-6 bg-gray-200 font-bold uppercase text-sm text-grey-dark border-b border-gray-100">
                Round
              </th>
              <th className="py-4 px-6 bg-gray-200 font-bold uppercase text-sm text-grey-dark border-b border-gray-100">
                Winner
              </th>
            </tr>
          </thead>
          <tbody>
            {rounds.length > 0 ? (
              rounds.map((round) => (
                <tr>
                  <td className="py-4 px-6 border-b border-gray-100">
                    {round.round}
                  </td>
                  <td className="py-4 px-6 border-b border-gray-100">
                    {getPlayerName(round.winner)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2}>No data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Score;
