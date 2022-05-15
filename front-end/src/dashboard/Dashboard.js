import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { next, previous, today } from "../utils/date-time";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {

  //checks if url has date query, if not uses today
  const queryParams = new URLSearchParams(window.location.search)
  const dateQuery  = queryParams.get("date")
  const TODAY = today();

  const [date, setDate] = useState(dateQuery? dateQuery: TODAY);
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  const handleDays = (e) => {
    e.preventDefault();

    switch (e.target.innerText) {
      case "Next":
        setDate(next(date));
        break;
      case "Previous":
        setDate(previous(date));

        break;
      default:
        setDate(TODAY);
    }
  };

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      {JSON.stringify(reservations)}

      <button onClick={handleDays}>Next</button>
      <button onClick={handleDays}>Previous</button>
      <button onClick={handleDays}>Today</button>
    </main>
  );
}

export default Dashboard;
