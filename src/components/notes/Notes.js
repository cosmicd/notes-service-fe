import React from "react";
import { Route } from "react-router-dom";
import { AuthRoute, asyncComponent } from "../misc";

const AsyncNoteList = asyncComponent(() => import("./NoteList"));
const AsyncNewNote = asyncComponent(() => import("./NewNote"));
const AsyncNote = asyncComponent(() => import("./Note"));

const AppliedRoute = ({ component: C, authProps, ...rest }) => (
  <Route {...rest} render={props => <C {...props} {...authProps} />} />
);

export const NoteList = props => (
  <AppliedRoute {...props} component={AsyncNoteList} />
);
export const Note = props => (
<AuthRoute {...props} component={AsyncNote} />
);

export const NewNote = props => (
  <AppliedRoute {...props} component={AsyncNewNote} />
);
