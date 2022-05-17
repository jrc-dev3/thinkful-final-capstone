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

  const handleSubmit = (e) => {
    e.preventDefault()

    const abortController = new AbortController();
    setReservationsError(null);
    searchMobile({ mobile_number }, abortController.signal)
      .then(lst => {
        if(lst.length === 0) return "No reservations found"

        return lst
      })
      .then(setResults)
      .catch(setReservationsError);
  };

  return (
    <form>
      <ErrorAlert error={reservationsError} />
      <label htmlFor="mobile_number">Mobile Number: </label>
      <input
        required
        placeholder="555-555-1234 "
        value={mobile_number}
        name="mobile_number"
        type="text"
        //pattern="^[0-9]{3}-[0-9]{3}-[0-9]{4}$"
        onChange={handleOnChange}
      />

      <button type="submit" onClick={handleSubmit}>
        Find
      </button>

      <ReservationsList reservations={results} />
    </form>
  );
};

export default Search;
