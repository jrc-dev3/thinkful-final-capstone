import React, { useState } from "react";
import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { addTable } from "../utils/api";

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
    <form className="container p-3 d-flex flex-column">
      <ErrorAlert error={reservationsError} />
      <div className="form-group">
        <label htmlFor="table_name">Table Name: </label>
        <input
          className="form-control"
          required
          placeholder="Roof #1"
          value={table_name}
          name="table_name"
          type="text"
          onChange={handleOnChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="capacity">Capacity: </label>
        <input
          className="form-control"
          required
          placeholder="1"
          value={capacity}
          name="capacity"
          type="number"
          onChange={handleOnChange}
        />
      </div>

      <div className="d-flex justify-content-end">
        <button
          className="btn btn-danger ml-2"
          onClick={(e) => {
            e.preventDefault();
            history.goBack();
          }}
        >
          Cancel
        </button>
        <button
          className="btn btn-success ml-2"
          type="submit"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default NewTables;
