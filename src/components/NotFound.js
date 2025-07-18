import React from "react";
import { Link } from "react-router-dom";
import logo from "../Assets/logo.jpg";
import "../App.css";

const NotFound = () => (
  <div className="notfound-bg no-scrollbar">
    <div className="notfound-container no-bg">
      <img
        src={logo}
        alt="Vocabi Logo"
        className="vocabi-logo animate-fadein spin-logo"
        style={{
          width: 110,
          height: 110,
          borderRadius: "50%",
          marginBottom: 24,
          boxShadow: "0 4px 32px #e11d4888",
        }}
      />
      <h2 className="notfound-title animate-fadein-delay2">
        Oops! Page Not Found
      </h2>
      <p className="notfound-desc animate-fadein-delay3">
        The page you are looking for doesn't exist or has been moved.
        <br />
        Let's get you back to something fun!
      </p>
      <Link to="/" className="notfound-btn animate-fadein-delay4">
        Go to Home
      </Link>
    </div>
  </div>
);

export default NotFound;
