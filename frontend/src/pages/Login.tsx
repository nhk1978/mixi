import React from "react";
import { Link } from "react-router-dom";

import LoginForm from "../components/Form/LoginForm";

const Login = () => {
  return (
    <div className="form__wrapper">
      <h2 className="page__header">Login</h2>
      <LoginForm />
      <Link to="/register">Not have an account yet? Create one!</Link>
    </div>
  );
};

export default Login;
