import React, { Component } from "react";
import {
  HelpBlock,
  FormGroup,
  FormControl,
  ControlLabel
} from "react-bootstrap";
import LoaderButton from "../misc/LoaderButton";
import "./Signup.css";
import { CognitoUserPool, CognitoUser } from "amazon-cognito-identity-js";
import config from "../../config";

export default class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      email: "",
      password: "",
      confirmedPassword: "",
      confirmationCode: "",
      user: null
    };
  }

  validateForm() {
    return (
      this.state.email.length > 0 &&
      this.state.password.length > 0 &&
      this.state.password === this.state.confirmedPassword
    );
  }

  validateConfirmationForm() {
    return this.state.confirmationCode.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
      const passwordResetUser = await this.initiatePasswordReset();
      //console.log("user:", passwordResetUser);
      this.setState({
        user: passwordResetUser
      });
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  };

  handleConfirmationSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
      await this.confirmPassword();
      this.props.history.push("/login");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  };

  initiatePasswordReset() {
    const userPool = new CognitoUserPool({
      UserPoolId: config.aws.cognito.userpoolId,
      ClientId: config.aws.cognito.appClientId
    });
    const user = new CognitoUser({
      Username: this.state.email,
      Pool: userPool
    });

    return new Promise((resolve, reject) =>
      user.forgotPassword({
        onSuccess: result => resolve(user),
        onFailure: err => reject(err)
      })
    );
  }

  confirmPassword() {
    return new Promise((resolve, reject) =>
      this.state.user.confirmPassword(
        this.state.confirmationCode,
        this.state.confirmedPassword,
        {
          onSuccess: result => resolve(),
          onFailure: err => reject(err)
        }
      )
    );
  }

  renderConfirmationForm() {
    return (
      <form onSubmit={this.handleConfirmationSubmit}>
        <FormGroup controlId="confirmationCode" bsSize="large">
          <ControlLabel>Confirmation Code</ControlLabel>
          <FormControl
            autoFocus
            type="tel"
            value={this.state.confirmationCode}
            onChange={this.handleChange}
          />
          <HelpBlock>Please check your email for the code.</HelpBlock>
        </FormGroup>
        <LoaderButton
          block
          bsSize="large"
          disabled={!this.validateConfirmationForm()}
          type="submit"
          isLoading={this.state.isLoading}
          text="Verify"
          loadingText="Verifying…"
        />
      </form>
    );
  }

  renderForm() {
    return (
      <form onSubmit={this.handleSubmit}>
        <FormGroup controlId="email" bsSize="large">
          <ControlLabel>Email</ControlLabel>
          <FormControl
            autoFocus
            type="email"
            value={this.state.email}
            onChange={this.handleChange}
          />
        </FormGroup>
        <FormGroup controlId="password" bsSize="large">
          <ControlLabel>New Password</ControlLabel>
          <FormControl
            value={this.state.password}
            onChange={this.handleChange}
            type="password"
          />
        </FormGroup>
        <FormGroup controlId="confirmedPassword" bsSize="large">
          <ControlLabel>Confirm New Password</ControlLabel>
          <FormControl
            value={this.state.confirmedPassword}
            onChange={this.handleChange}
            type="password"
          />
        </FormGroup>
        <LoaderButton
          block
          bsSize="large"
          disabled={!this.validateForm()}
          type="submit"
          isLoading={this.state.isLoading}
          text="Reset Password"
          loadingText="Resetting password"
        />
      </form>
    );
  }

  render() {
    return (
      <div className="Signup">
        {this.state.user === null
          ? this.renderForm()
          : this.renderConfirmationForm()}
      </div>
    );
  }
}
