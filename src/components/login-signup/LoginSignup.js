import React from "react";
import { UnauthRoute, asyncComponent } from "../misc";
const AsyncLogin = asyncComponent(() => import("./Login"));
const AsyncSignup = asyncComponent(() => import("./Signup"));
const AsyncResetPassword = asyncComponent(() => import("./ResetPassword"));

export const Login = props => <UnauthRoute {...props} component={AsyncLogin} />;
export const Signup = props => (
  <UnauthRoute {...props} component={AsyncSignup} />
);
export const ResetPassword = props => (
  <UnauthRoute {...props} component={AsyncResetPassword} />
);
