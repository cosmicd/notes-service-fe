import React from "react";
import { Route, Switch } from "react-router-dom";
import { asyncComponent } from "./components/misc";
import { Login,Signup,ResetPassword } from "./components/login-signup";
import { NoteList,Note,NewNote } from "./components/notes";
const AsyncNotFound = asyncComponent(() =>
  import("./components/misc/NotFound")
);

export default props => (
  <Switch>
    <NoteList exact path= "/" authProps={props} />  
    <NewNote exact path= "/notes/new" authProps={props} />  
    <Note exact path= "/notes/:id" authProps={props} />
    <Login exact path= "/login" authProps={props} />
    <Signup exact path= "/signup" authProps={props} />
    <ResetPassword exact path= "/resetpwd" authProps={props} />   
    {/* Finally, catch all unmatched routes */}
    <Route component={AsyncNotFound} />
  </Switch>
);
