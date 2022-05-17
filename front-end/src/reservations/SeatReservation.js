import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { listTables, readReservation, seatReservation } from "../utils/api";

const SeatReservation = () => {
  const [reservation, setReservation] = useState({});
  const [tableSelection, setTableSelection] = useState(1);
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  const { reservation_id } = useParams();
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    setReservationsError(null);

    const selected_table = tables.find(
      ({ table_id }) => table_id === Number(tableSelection)
    );
    const { people } = reservation;
    const { table_id, capacity } = selected_table;

    if (people > capacity) {
      setReservationsError(Error("People more than capacity."));
      return;
    }

    const data = { table_id, reservation_id: Number(reservation_id) };
    const updatedBody = { status: "seated"}
    const abortController = new AbortController();
    seatReservation(data, abortController.signal)
      .then(() => history.push("/dashboard"))
      .catch(setReservationsError);

    

    return () => abortController.abort();
  };

  const handleSelection = (e) => {
    e.preventDefault();
    setTableSelection(e.target.value);
  };

  useEffect(loadData, []);

  function loadData() {
    const abortController = new AbortController();
    setReservationsError(null);
    readReservation(reservation_id, abortController.signal)
      .then(setReservation)
      .catch(setReservationsError);

    listTables(abortController.signal)
      .then((tables) => {
        setTableSelection(tables[0]["table_id"]);
        return tables;
      })
      .then(setTables)
      .catch(setReservationsError);

    return () => abortController.abort();
  }
  return (
    <form>
      <ErrorAlert error={reservationsError} />
      <label htmlFor="tables">Table number: </label>

      <select name="table_id" id="table_id" onChange={handleSelection}>
        {tables.map(({ table_id, table_name, capacity }) => (
          <option key={table_id} value={table_id}>
            {table_name} - {capacity}
          </option>
        ))}
      </select>
      <button type="submit" onClick={handleSubmit}>Submit</button>
      <button onClick={() => history.goBack()}>Cancel</button>
    </form>
  );
};

export default SeatReservation;
