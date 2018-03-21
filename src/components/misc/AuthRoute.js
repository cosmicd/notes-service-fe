import React from "react";
import { Route, Redirect } from "react-router-dom";

export default ({ component: C, authProps, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      authProps.isAuthenticated ? (
        <C {...props} {...authProps} />
      ) : (
        <Redirect
          to={`/login?redirect=${props.location.pathname}${
            props.location.search
          }`}
        />
      )
    }
  />
);
