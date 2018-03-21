import React from "react";
import { Link } from "react-router-dom";
import { Nav, NavItem, Navbar } from "react-bootstrap";
import { Route } from "react-router-dom";

const RouteNavItem = props =>
  <Route
    path={props.href}
    exact
    children={({ match, history }) =>
      <NavItem
        onClick={e => history.push(e.currentTarget.getAttribute("href"))}
        {...props}
        active={match ? true : false}
      >
        {props.children}
      </NavItem>}
  />;

const NBHeader = props => {
  return (
    <Navbar.Header>
      <Navbar.Brand>
        <Link to="/">{props.brandName}</Link>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
  );
};
const NBAuthControl = props => {
  return (
    <Navbar.Collapse>
      <Nav pullRight>
        {props.isAuthenticated ? (
          <NavItem onClick={props.handleLogout}>Logout</NavItem>
        ) : (
          [
            <RouteNavItem key={1} href="/signup">
              Signup
            </RouteNavItem>,
            <RouteNavItem key={2} href="/login">
              Login
            </RouteNavItem>
          ]
        )}
      </Nav>
    </Navbar.Collapse>
  );
};
export default props => {
  const { brandName, ...other } = props;
  return (
    <Navbar fluid collapseOnSelect>
      <NBHeader brandName={brandName} />
      <NBAuthControl {...other} />
    </Navbar>
  );
};
