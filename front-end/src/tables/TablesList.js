import React from "react";

const TablesList = ({ tables }) => {
  return (
    <section>
      {tables.map(
        ({
          table_id,
          table_name,
          capacity,
          reservation_id
        }) => (
          <article key={table_id} style={{border: 'solid'}}>
            <p>{table_name}</p>
            <p>{capacity}</p>
            <p data-table-id-status={table_id} >{reservation_id ? "OCCUPIED": "FREE"}</p>
          </article>
        )
      )}
    </section>
  );
};

export default TablesList;
