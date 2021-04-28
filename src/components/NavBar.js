import React, { useState, Fragment } from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import config from "../auth_config.json";
import {
  Collapse,
  Container,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import { useAuth0 } from "@auth0/auth0-react";

const { apiOrigin = "http://localhost:3000" } = config;

const NavBar = () => {
    // Used for Role Based Access Control

    const [state, setState] = useState({
        showResult: false,
        endpointMessage: "",
        error: null
    });

    const {
        getAccessTokenSilently
    } = useAuth0();

    const callRoleBasedEndpoint = async () => {
        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(`${apiOrigin}/api/role`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const responseData = await response.json();
            setState({
                ...state,
                showResult: true,
                endpointMessage: responseData
            });
            console.log("test");
        } catch (error) {
            setState({
                ...state,
                error: error.error
            });
        }
    };
    // The admin tools in the dropdown menu should check to see if the user token has the
    // access:tools permission and if so allow it to access the page otherwise
    // print an error like "You do not have Access to Admin Tools, if you feel this is a mistake please
    // contact the ME Team"

  const [isOpen, setIsOpen] = useState(false);
  const {
    user,
    isAuthenticated,
    loginWithRedirect,
    logout,
  } = useAuth0();
  const toggle = () => setIsOpen(!isOpen);

  const logoutWithRedirect = () =>
    logout({
      returnTo: window.location.origin,
    });

  const showTools = false;

  if (isAuthenticated){
  if (user.["http://localhost:3000/roles"].includes("Admin")){
    showTools = true;
  }
  }

  return (
    <Fragment>
    <div className="nav-container">
      <Navbar color="light" light expand="md">
        <Container>
          <NavbarBrand className="logo" />
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="mr-auto" navbar>
              <NavItem>
                <NavLink
                  tag={RouterNavLink}
                  to="/"
                  exact
                  activeClassName="router-link-exact-active"
                >
                  Home
                </NavLink>
              </NavItem>
              {isAuthenticated && (
                <NavItem>
                  <NavLink
                    tag={RouterNavLink}
                    to="/create-reservation"
                    exact
                    activeClassName="router-link-exact-active"
                  >
                    Make Reservation
                  </NavLink>
                </NavItem>
              )}
            </Nav>
            <Nav className="d-none d-md-block" navbar>
              {!isAuthenticated && (
                <NavItem>
                  <Button
                    id="qsLoginBtn"
                    color="primary"
                    className="btn-margin"
                    onClick={() => loginWithRedirect()}
                  >
                    Log in
                  </Button>
                </NavItem>
              )}
              {isAuthenticated && (
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret id="profileDropDown">
                    <img
                      src={user.picture}
                      alt="Profile"
                      className="nav-user-profile rounded-circle"
                      width="50"
                    />
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem header>{user.name}</DropdownItem>
                    <DropdownItem
                      tag={RouterNavLink}
                      to="/profile"
                      className="dropdown-profile"
                      activeClassName="router-link-exact-active"
                    >
                      <FontAwesomeIcon icon="user" className="mr-3" /> My Reservations
                    </DropdownItem>
                    {showTools &&(
                    <DropdownItem
                      tag={RouterNavLink}
                        to="/manage-billing"
                        className="dropdown-profile"
                        activeClassName="router-link-exact-active"
                        disabled="true"
                     >
                      <FontAwesomeIcon icon="user" className="mr-3" /> Manage Billing Codes
                    </DropdownItem>
                  )}
                  {showTools &&(
                    <DropdownItem
                      tag={RouterNavLink}
                        to="/manage-machines"
                        className="dropdown-profile"
                        activeClassName="router-link-exact-active"
                     >
                      <FontAwesomeIcon icon="user" className="mr-3" /> Manage Machines
                    </DropdownItem>
                    )}
                    {showTools &&(
                    <DropdownItem
                      tag={RouterNavLink}
                        to="/manage-reservations"
                        className="dropdown-profile"
                        activeClassName="router-link-exact-active"

                     >
                      <FontAwesomeIcon icon="user" className="mr-3" /> Manage Reservations
                    </DropdownItem>
                    )}

                    <DropdownItem
                      id="qsLogoutBtn"
                      onClick={() => logoutWithRedirect()}
                    >
                      <FontAwesomeIcon icon="power-off" className="mr-3" /> Log
                      out
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              )}
            </Nav>
            {!isAuthenticated && (
              <Nav className="d-md-none" navbar>
                <NavItem>
                  <Button
                    id="qsLoginBtn"
                    color="primary"
                    block
                    onClick={() => loginWithRedirect({})}
                  >
                    Log in
                  </Button>
                </NavItem>
              </Nav>
            )}
            {isAuthenticated && (
              <Nav
                className="d-md-none justify-content-between"
                navbar
                style={{ minHeight: 170 }}
              >
                <NavItem>
                  <span className="user-info">
                    <img
                      src={user.picture}
                      alt="Profile"
                      className="nav-user-profile d-inline-block rounded-circle mr-3"
                      width="50"
                    />
                    <h6 className="d-inline-block">{user.name}</h6>
                  </span>
                </NavItem>
                <NavItem>
                  <FontAwesomeIcon icon="user" className="mr-3" />
                  <RouterNavLink
                    to="/profile"
                    activeClassName="router-link-exact-active"
                  >
                    My Reservations
                  </RouterNavLink>
                </NavItem>
                {showTools &&(
                <NavItem>
                  <FontAwesomeIcon icon="user" className="mr-3" />
                  <RouterNavLink
                    to="/manage-billing"
                    activeClassName="router-link-exact-active"
                  >
                    Manage Billing Codes
                  </RouterNavLink>
                </NavItem>
              )}
              {showTools &&(
                <NavItem>
                  <FontAwesomeIcon icon="user" className="mr-3" />
                  <RouterNavLink
                    to="/manage-machines"
                    activeClassName="router-link-exact-active"
                  >
                    Manage Machines
                  </RouterNavLink>
                </NavItem>
              )}
              {showTools &&(
                <NavItem>
                  <FontAwesomeIcon icon="user" className="mr-3" />
                  <RouterNavLink
                    to="/manage-reservations"
                    activeClassName="router-link-exact-active"
                  >
                    Manage Reservations
                  </RouterNavLink>
                </NavItem>
              )}
                <NavItem>
                  <FontAwesomeIcon icon="power-off" className="mr-3" />
                  <RouterNavLink
                    to="#"
                    id="qsLogoutBtn"
                    onClick={() => logoutWithRedirect()}
                  >
                    Log out
                  </RouterNavLink>
                </NavItem>
              </Nav>
            )}
          </Collapse>
        </Container>
      </Navbar>
    </div>
    </Fragment>
  );
};

export default NavBar;
