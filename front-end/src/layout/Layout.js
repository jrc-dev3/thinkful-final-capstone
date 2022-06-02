import React from "react";
import Menu from "./Menu";
import Routes from "./Routes";

import "./Layout.css";

/**
 * Defines the main layout of the application.
 *
 * You will not need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Layout() {
  return (
    <div className="container-fluid">

      <div className="row h-100 ">
        <div className="col-sm-2 col-md-2 d-flex justify-content-center align-items-center side-bar">
          <Menu />
        </div>


        <div className="col pt-2 main-content">
          <Routes />
        </div>

      </div>
    </div>
  );
}

export default Layout;
