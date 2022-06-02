import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationsList from "../reservations/ReservationsList";
import { searchMobile } from "../utils/api";

const Search = () => {
  const [results, setResults] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [mobile_number, setMobileNumber] = useState("");

  const handleOnChange = (e) => {
    setMobileNumber(e.target.value);
  };

  const fetchResults = () => {
    const abortController = new AbortController();
    setReservationsError(null);
    searchMobile(mobile_number, abortController.signal)
      .then(lst => {
        if(lst.length === 0) return "No reservations found"

        return lst
      })
      .then(setResults)
      .catch(setReservationsError);
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    fetchResults()
  };

  return (
    <form className="container p-3 d-flex flex-column">
      <ErrorAlert error={reservationsError} />
      <div className="form-group">
        <label htmlFor="mobile_number">Mobile Number: </label>
        <input
          className="form-control"
          required
          placeholder="555-555-1234 "
          value={mobile_number}
          name="mobile_number"
          type="text"
          //pattern="^[0-9]{3}-[0-9]{3}-[0-9]{4}$"
          onChange={handleOnChange}
        />
      </div>


      <button className="btn btn-primary" type="submit" onClick={handleSubmit}>
        Find
      </button>

      <ReservationsList reservations={results} refresh={fetchResults} />
    </form>
  );
};

export default Search;
