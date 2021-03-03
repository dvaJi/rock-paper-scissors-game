import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { createNewRule } from "./rulesSlice";

type FormData = {
  name: string;
  kills: string;
};

function RuleForm() {
  const dispatch = useDispatch();
  const { register, handleSubmit, errors, reset } = useForm<FormData>();
  const onSubmit = handleSubmit((data) => {
    dispatch(createNewRule(data));
    reset();
  });

  return (
    <div className="card">
      <h1>Create new rule</h1>
      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-6 gap-6">
          <div className="self-center">Name</div>
          <div className="col-span-5">
            <input
              name="name"
              placeholder="Name"
              className="input-txt"
              ref={register({ required: true })}
            />
            {errors.name && "Name is required"}
          </div>
          <div className="self-center">Kills</div>
          <div className="col-span-5">
            <input
              name="kills"
              placeholder="Kills"
              className="input-txt"
              ref={register({ required: true })}
            />
            {errors.kills && "Kills is required"}
          </div>
          <button className="btn-primary col-span-6" type="submit">
            Create Rule
          </button>
        </div>
      </form>
    </div>
  );
}

export default RuleForm;
