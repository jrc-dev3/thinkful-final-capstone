import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { freeTable } from "../utils/api";

const TablesList = ({ tables, loadDashboard }) => {
  const [cleanupError, setCleanupError] = useState(null);

  const handleCleanup = async (e) => {
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      try {
        const table_id = Number(e.target.getAttribute("data-table-id-finish"));
        await freeTable(table_id);
        await loadDashboard();
      } catch (e) {
        setCleanupError(e);
      }
    }
  };
  return (
    <section className="container">
      <ErrorAlert error={cleanupError} />
      {tables.map(({ table_id, table_name, capacity, reservation_id }) => (
        <section key={table_id} className="card p-3 my-3 shadow">
          <article className="class-body">
            <p className="card-text"><b>Table Name:</b> {table_name}</p>
            <p className="card-text"><b>Capacity:</b> {capacity}</p>
            <p className="card-text" data-table-id-status={table_id}>
              <b>Status:</b> {reservation_id ? "OCCUPIED" : "FREE"}
            </p>
            {reservation_id && (
              <span className="d-flex justify-content-end">
                <button
                  className="btn btn-success"
                  data-table-id-finish={table_id}
                  type="submit"
                  onClick={handleCleanup}
                >
                  Finish
                </button>
              </span>
            )}
          </article>
        </section>
      ))}
    </section>
  );
};

export default TablesList;
