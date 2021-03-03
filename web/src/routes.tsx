import { Route, Switch } from "react-router-dom";

import CreateMatch from "./features/match/CreateMatch";
import Match from "./features/match/Match";
import Rules from "./features/rules/Rules";

export default (
  <Switch>
    <Route path="/" exact component={CreateMatch} />
    <Route path="/match/:id" exact component={Match} />
    <Route path="/rules" exact component={Rules} />
  </Switch>
);
