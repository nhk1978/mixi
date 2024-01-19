import React from "react";
import { Link } from "react-router-dom";

import Helmet from "../../components/Helmet";

const Dashboard = () => {
  return (
    <Helmet title="Dashboard">
      <div className="dashboard">
        <nav className="dashboard__navigation">
          <Link
            className="fit-button__primary"
            to="/dashboard/product-management"
          >
            Product management
          </Link>
          <Link
            className="fit-button__primary"
            to="/dashboard/category-management"
          >
            Category management
          </Link>
          <Link
            className="fit-button__primary"
            to="/dashboard/order-management"
          >
            Order management
          </Link>
        </nav>
      </div>
    </Helmet>
  );
};

export default Dashboard;
