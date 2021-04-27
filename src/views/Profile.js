import React from "react";
import { Container, Row, Col } from "reactstrap";

import Highlight from "../components/Highlight";
import Loading from "../components/Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import UserReservationsTable from "../components/Reservations/UserReservationsTable";

export const ProfileComponent = () => {
  const { user } = useAuth0();

  console.log(user);

  return (
    <Container className="mb-5">
      <Row className="align-items-center profile-header mb-5 text-center text-md-left">
        <Col md={2}>
          <img
            src={user.picture}
            alt="Profile"
            className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
          />
        </Col>
        <Col md>
          <h2>{user.nickname}</h2>
          <p className="lead text-muted">{user.email}</p>
        </Col>
          </Row>
          <hr />
      <Row>
              <div className="mb-5">
          <h2 className="mb-5">Your Reservations</h2>
         </div>
         {<UserReservationsTable />}
      </Row>
    </Container>
  );
};

export default withAuthenticationRequired(ProfileComponent, {
  onRedirecting: () => <Loading />,
});
