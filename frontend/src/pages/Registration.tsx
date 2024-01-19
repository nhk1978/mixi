import React from "react";
import { Link } from "react-router-dom";

import Helmet from "../components/Helmet";
import RegisterForm from "../components/Form/RegisterForm";

const Registration = () => {
  return (
    <Helmet title="Registration">
      <div className="registration__wrapper">
        <h2 className="page__header">Registration</h2>
        <RegisterForm />
        <Link to="/login">Already had an account? Login!</Link>
      </div>
    </Helmet>
  );
};

export default Registration;
