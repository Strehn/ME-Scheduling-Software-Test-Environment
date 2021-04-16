import React from "react";

import logo from "../assets/logo.svg";

const Hero = () => (
  <div className="text-center hero my-5">
    <img className="mb-3 app-logo" src={logo} alt="UofI logo" width="120" />
    <h1 className="mb-4">Machine Shop Scheduling</h1>

    <p className="lead">
      Schedule for machines and services of the Machine Shop. View more about the <a href="https://www.uidaho.edu/research/shared-resources/materials-fabrication-and-characterization/mechanical-engineering-machine-shop">Machine Shop</a>
    </p>
  </div>
);

export default Hero;
