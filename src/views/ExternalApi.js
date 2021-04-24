import React, { useState } from "react";
import { Button, Alert } from "reactstrap";
import Highlight from "../components/Highlight";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import config from "../auth_config.json";
import Loading from "../components/Loading";
import Content from "../components/Content";
import Scheduler from "../components/makeRes";
import moment from "moment";

const { apiOrigin = "http://localhost:3001" } = config;
export const ReservationDataContext = React.createContext();

export const ExternalApiComponent = () => {
  const [state, setState] = useState({
    showResult: false,
    apiMessage: "",
    error: null,
  });

  const [reservationData, setReservationData] = useState({
    lathe_1: [
        {
            startTime: moment(7, "HH").toISOString(),
            endTime: moment(12, "HH").toISOString()
        },
        {
            startTime: moment(17, "HH").toISOString(),
            endTime: moment(19, "HH").toISOString()
        }
    ],
    lathe_2: [
        {
            startTime: moment(11, "HH").toISOString(),
            endTime: moment(15, "HH").toISOString()
        }
    ],
    computer: [
        {
            startTime: moment(7, "HH").toISOString(),
            endTime: moment(8, "HH").toISOString()
        },
        {
            startTime: moment(17, "HH").toISOString(),
            endTime: moment(19, "HH").toISOString()
        }
    ],
    printer: [
        {
            startTime: moment(13, "HH").toISOString(),
            endTime: moment(17, "HH").toISOString()
        }
    ],
    remote_login_pc: [
        {
            startTime: moment(8, "HH").toISOString(),
            endTime: moment(11, "HH").toISOString()
        },
        {
            startTime: moment(18, "HH").toISOString(),
            endTime: moment(21, "HH").toISOString()
        }
    ],
    sindoh: [
        {
            startTime: moment(7, "HH").toISOString(),
            endTime: moment(9, "HH").toISOString()
        },
        {
            startTime: moment(15, "HH").toISOString(),
            endTime: moment(17, "HH").toISOString()
        }
    ]
  });

  const {
    getAccessTokenSilently,
    loginWithPopup,
    getAccessTokenWithPopup,
  } = useAuth0();

  const handleConsent = async () => {
    try {
      await getAccessTokenWithPopup();
      setState({
        ...state,
        error: null,
      });
    } catch (error) {
      setState({
        ...state,
        error: error.error,
      });
    }

    await callApi();
  };

  const handleLoginAgain = async () => {
    try {
      await loginWithPopup();
      setState({
        ...state,
        error: null,
      });
    } catch (error) {
      setState({
        ...state,
        error: error.error,
      });
    }

    await callApi();
  };

  const callApi = async () => {
    try {
      const token = await getAccessTokenSilently();

      const response = await fetch(`${apiOrigin}/api/external`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.json();

      setState({
        ...state,
        showResult: true,
        apiMessage: responseData,
      });
    } catch (error) {
      setState({
        ...state,
        error: error.error,
      });
    }
  };

  const handle = (e, fn) => {
    e.preventDefault();
    fn();
  };

  return (
    <>
      <div className="mb-5">
        {state.error === "consent_required" && (
          <Alert color="warning">
            You need to{" "}
            <a
              href="#/"
              class="alert-link"
              onClick={(e) => handle(e, handleConsent)}
            >
              consent to get access to users api
            </a>
          </Alert>
        )}

        {state.error === "login_required" && (
          <Alert color="warning">
            You need to{" "}
            <a
              href="#/"
              class="alert-link"
              onClick={(e) => handle(e, handleLoginAgain)}
            >
              log in again
            </a>
          </Alert>
        )}
        <ReservationDataContext.Provider value={{ reservationData, setReservationData }}>
              <h1>Reservations</h1>
              <Content />
              <hr />


              <Scheduler reservationData={reservationData} />
        </ReservationDataContext.Provider>
      </div>
    </>
  );
};

export default withAuthenticationRequired(ExternalApiComponent, {
  onRedirecting: () => <Loading />,
});
