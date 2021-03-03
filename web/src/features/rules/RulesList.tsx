import { memo } from "react";
import { useDispatch } from "react-redux";
import { deleteRule } from "./rulesSlice";
import { Rule } from "./types";

type RulesListProps = {
  rules: Rule[];
};
const RulesList = ({ rules }: RulesListProps) => {
  const dispatch = useDispatch();
  return (
    <table className="text-left w-full border-collapse">
      <thead>
        <tr>
          <th className="py-4 px-6 bg-gray-200 font-bold uppercase text-sm text-grey-dark border-b border-gray-100">
            Name
          </th>
          <th className="py-4 px-6 bg-gray-200 font-bold uppercase text-sm text-grey-dark border-b border-gray-100">
            Kills
          </th>
          <th className="py-4 px-6 bg-gray-200 font-bold uppercase text-sm text-grey-dark border-b border-gray-100">
            Action
          </th>
        </tr>
      </thead>
      <tbody>
        {rules.length > 0 &&
          rules.map((rule) => (
            <tr key={rule.id}>
              <td className="py-4 px-6 border-b border-gray-100">
                {rule.name}
              </td>
              <td className="py-4 px-6 border-b border-gray-100">
                {rule.kills}
              </td>
              <td className="py-4 px-6 border-b border-gray-100">
                <button
                  className="ml-5"
                  onClick={() => dispatch(deleteRule(rule.id))}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default memo(RulesList);
