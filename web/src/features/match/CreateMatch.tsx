import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import clsx from "clsx";

import RulesList from "../rules/RulesList";
import { fetchRules, selectIsLoading, selectRules } from "../rules/rulesSlice";
import { selectMatch, createNewMatch } from "./matchSlice";

type FormData = {
  playerOne: string;
  playerTwo: string;
};

export function Match() {
  const history = useHistory();
  const dispatch = useDispatch();

  const match = useSelector(selectMatch);
  const rules = useSelector(selectRules);
  const isLoading = useSelector(selectIsLoading);

  const { register, handleSubmit, errors } = useForm<FormData>();
  const onSubmit = handleSubmit(async (data) => {
    dispatch(createNewMatch(data));
  });

  useEffect(() => {
    if (match.id) {
      history.push(`/match/${match.id}`);
    }
  }, [match.id, history]);

  useEffect(() => {
    dispatch(fetchRules());
  }, [dispatch]);

  return (
    <>
      <div className="card relative">
        <div
          className={clsx("absolute z-10 w-4/5 h-full", {
            hidden: rules.length > 0,
            block: rules.length === 0,
          })}
        >
          <h1 className="text-3xl text-center font-bold py-28">
            Add some rules before start the game.
          </h1>
        </div>
        <div className={clsx({ "blur-2": rules.length === 0 && !isLoading })}>
          <h1 className="mb-5">Enter Player's Names</h1>
          <form onSubmit={onSubmit}>
            <div className="grid grid-cols-6 gap-6">
              <div className="self-center">Player One</div>
              <div className="col-span-5">
                <input
                  name="playerOne"
                  placeholder="Player name"
                  className="input-txt col-span-6"
                  type="text"
                  data-testid="playerOne"
                  ref={register({ required: true })}
                />

                {errors.playerOne && <span role="alert">Name is required</span>}
              </div>
              <div className="self-center">Player Two</div>
              <div className="col-span-5">
                <input
                  name="playerTwo"
                  placeholder="Player name"
                  className="input-txt"
                  type="text"
                  data-testid="playerTwo"
                  ref={register({ required: true })}
                />
                {errors.playerTwo && <span role="alert">Name is required</span>}
              </div>
              <button className="btn-primary col-span-6" type="submit">
                Start
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="card">
        <h1 className="mb-5">Current rules</h1>
        <RulesList rules={rules} />
        <div>
          <Link to="/rules">
            <button className="btn-primary">Create rules</button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Match;
