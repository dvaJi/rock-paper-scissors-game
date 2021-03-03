import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { fetchRules, selectRules } from "./rulesSlice";

import RuleForm from "./RuleForm";
import RulesList from "./RulesList";

function Rules() {
  const dispatch = useDispatch();
  const rules = useSelector(selectRules);

  useEffect(() => {
    dispatch(fetchRules());
  }, [dispatch]);
  return (
    <>
      <Link
        to="/"
        className="btn-primary w-11/12 sm:w-8/12 md:w-1/3 lg:w-4/12 text-center"
      >
        Back
      </Link>
      <RuleForm />
      <div className="card">
        <h1>Current rules</h1>
        <RulesList rules={rules} />
      </div>
    </>
  );
}

export default Rules;
