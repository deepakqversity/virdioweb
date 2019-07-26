import React, { Component } from "react";
import { Link } from "react-router-dom";
class Navbar extends Component {
  render() {
    return (
      <div className="navbar-fixed">
        <nav className="z-depth-0">
          <div className="nav-wrapper white">
            <h4 className="text-center">Virdio Conference</h4>
          </div>
        </nav>
      </div>
    );
  }
}
export default Navbar;