import React, { Component } from "react";

import { Row, Col } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Calendar from "./Calander";

class Content extends Component {
  render() {
    return (
      <div className="text-center hero my-5">
        <h2 className="text-center hero my-5">Weekly Schedule</h2>
        <Calendar/>
      </div>
    );
  }
}

export default Content;
