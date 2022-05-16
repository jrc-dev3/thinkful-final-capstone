import React, { useState } from "react";
import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import {  addTable } from "../utils/api";

const NewTables = () => {
  const initialForm = {
    table_name: "",
    capacity: "",
  };

  const [formData, setFormData] = useState({ ...initialForm });
  const [reservationsError, setReservationsError] = useState(null);
  const history = useHistory();

  const isValidForm = (form) => {
    const { table_name, capacity } = form;
    setReservationsError(null);

    if (table_name.length < 2) {
      setReservationsError("Min of 2 characters for table name.");
      return false;
    }

    if (capacity < 1) {
      setReservationsError("Min of 1 per table.");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const body = {
      table_name: formData.table_name,
      capacity: Number(formData.capacity),
    };

    if (isValidForm(body)) {
      const abortController = new AbortController();
      addTable(body, abortController.signal)
        .then(() => history.push(`/dashboard`))
        .catch(setReservationsError);

      return false;
    }
  };

  const handleOnChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const { table_name, capacity } = formData;

  return (
    <form>
      <ErrorAlert error={reservationsError} />
      <input
        required
        placeholder="John"
        value={table_name}
        name="table_name"
        type="text"
        onChange={handleOnChange}
      />
      <input
        required
        placeholder="1"
        value={capacity}
        name="capacity"
        type="number"
        onChange={handleOnChange}
      />

      <button type="submit" onClick={handleSubmit}>
        Submit
      </button>
      <button onClick={() => history.goBack()}>Cancel</button>
    </form>
  );
};

export default NewTables;
