import React from "react";
import { withRouter } from "react-router-dom";
import { authUser, signOutUser } from "./aws";
import { Navbar } from "./components/misc";
import Routes from "./Routes";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      isAuthenticating: true
    };
  }

  async componentDidMount() {
    try {
      if (await authUser()) {
        this.userHasAuthenticated(true);
      }
    } catch (e) {
      alert(e);
    }
    this.setState({ isAuthenticating: false });
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  };
  // Below, have to use arrow function otherwise need to bind
  // the method in the constructor (this.handleLogout = this.handleLogout.bind(this);) explicity
  handleLogout = event => {
    signOutUser();

    this.userHasAuthenticated(false);

    this.props.history.push("/login");
  };

  render() {
    const authProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    };
    return (
      !this.state.isAuthenticating && (
        <div className="App container">
          <Navbar
            brandName={this.props.brandName}
            isAuthenticated={authProps.isAuthenticated}
            handleLogout={this.handleLogout}
          />
          <Routes {...authProps} />
        </div>
      )
    );
  }
}

export default withRouter(App);
