import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import NewTable from "../tables/NewTable";
import SeatReservation from "../reservations/SeatReservation";
import Search from "../search/Search";
import ReservationForm from "../reservations/ReservationForm";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  return (

    <main className="container-fluid overflow-auto">
      <Switch>
        <Route exact={true} path="/">
          <Redirect to={'/dashboard'} />
        </Route>
        <Route exact={true} path="/reservations/:reservation_id/seat">
          <SeatReservation />
        </Route>
        <Route exact={true} path="/reservations/:reservation_id/edit">
          <ReservationForm />
        </Route>
        <Route exact={true} path="/reservations/new">
          <ReservationForm />
        </Route>
        <Route exact={true} path="/tables/new">
          <NewTable />
        </Route>
        <Route path="/dashboard">
          <Dashboard />
        </Route>
        <Route path="/search">
          <Search />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </main>

  );
}

export default Routes;
