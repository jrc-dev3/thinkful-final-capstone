import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { next, previous, today } from "../utils/date-time";
import ReservationsList from "../reservations/ReservationsList";
import TablesList from "../tables/TablesList";
import { useHistory } from "react-router";

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
  const [tables, setTables] = useState([])
  const [reservationsError, setReservationsError] = useState(null);
  const history = useHistory()

  useEffect(() => {
    const updateUrlWithQuery = () => {

      const abortController = new AbortController();
      history.push(`/dashboard?date=${date}`)
      return () => abortController.abort();

    }

    updateUrlWithQuery()
    
  }, [date])

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

    listTables(abortController.signal)
      .then(setTables)
      .catch(setReservationsError)
      
    
    return () => abortController.abort();
  }

  return (
    <section className="container d-flex p-4 flex-column align-items-center">
      {/* <h1>Dashboard</h1> */}
      <div className="d-md-flex mb-3">
        <h2 className="mb-0 ds-header">Reservations:</h2>
      </div>
      <ErrorAlert error={reservationsError} />
      <ReservationsList reservations={reservations} refresh={loadDashboard} />

      <div className="d-md-flex mb-3">
        <h2 className="mb-0 ds-header">Tables:</h2>
      </div>
      <TablesList tables={tables} loadDashboard={loadDashboard} />

      <div className="w-100 d-inline-flex justify-content-center">
        <button className="btn btn-primary ml-2" onClick={handleDays}>Previous</button>
        <button className="btn btn-outline-secondary ml-2" onClick={handleDays}>Today</button>
        <button className="btn btn-primary ml-2" onClick={handleDays}>Next</button>
      </div>


    </section>
  );
}

export default Dashboard;
