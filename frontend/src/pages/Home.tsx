import React from "react";
import { Link } from "react-router-dom";

import onlineBanner from "../assets/images/online_banner.jpg";
import Helmet from "../components/Helmet";

const Home = () => {
  return (
    <Helmet title="Home">
      <section className="home">
        <div className="home__text">
          <h2 className="home__text__sub-header">Shop More,</h2>
          <h1 className="home__text__header">Shop Mixi</h1>
          <p className="home__text__description">            
            Welcome to Shop Mixi!
            Exciting times ahead: exclusive offers, insider tips, and much more, are all coming your way.
            Stay tuned! 
          </p>
          <Link to="/products" className="home__text__call-to-action">
            Shop now <i className="fa-sharp fa-solid fa-bag-shopping" style={{color: "#63E6BE",}}></i>
          </Link>
        </div>
        <div className="home__hero-banner">
          <img src={onlineBanner} alt="hero-banner" />
        </div>
      </section>
    </Helmet>
  );
};

export default Home;
