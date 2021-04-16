import React, { Component } from "react";

import { Row, Col } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Layout from '../hoc/Layout';
import RoomAvailability from '../hoc/RoomAvailability';



class Scheduler extends Component {
    render() {
        return (
            <div>
                <Layout>
                    <RoomAvailability />
                </Layout>
            </div>
        );
    }
}

export default Scheduler;
