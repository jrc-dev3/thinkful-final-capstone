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
        setCleanupError(e)
      }
    }
  };
  return (
    <section>
      <ErrorAlert error={cleanupError}/>
      {tables.map(({ table_id, table_name, capacity, reservation_id }) => (
        <article key={table_id} style={{ border: "solid" }}>
          <p>{table_name}</p>
          <p>{capacity}</p>
          <p data-table-id-status={table_id}>
            {reservation_id ? "OCCUPIED" : "FREE"}
          </p>
          {reservation_id && (
            <button
              data-table-id-finish={table_id}
              type="submit"
              onClick={handleCleanup}
            >
              Finish
            </button>
          )}
        </article>
      ))}
    </section>
  );
};

export default TablesList;
