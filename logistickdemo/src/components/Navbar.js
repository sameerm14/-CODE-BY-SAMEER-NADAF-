import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "./Navbar.css";
export default function Navbar() {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <a className="navbar-brand text-decoration-none" href="/">
          LogiFlow
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto" style={{ marginLeft: "65%" }}>
            <li className="nav-item active">
              <a className="nav-link text-decoration-none" href="/">
                Home
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link text-decoration-none" href="/services">
                Services
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-decoration-none" href="contact">
                Contact
              </a>
            </li>

            {isAuthenticated ? (
              <li className="nav-item">
                <button
                  className="btn text-white"
                  onClick={() =>
                    logout({
                      logoutParams: { returnTo: window.location.origin },
                    })
                  }
                >
                  log out
                </button>
              </li>
            ) : (
              <li className="nav-item">
                <button
                  className="btn text-white"
                  onClick={() => loginWithRedirect()}
                >
                  log in
                </button>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
}
