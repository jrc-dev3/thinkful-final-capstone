import React from "react";

const ReservationsList = ({ reservations }) => {


  if(typeof reservations === "string") return <h2>{reservations}</h2>

  return (
    <section>
      {reservations.map(
        ({
          reservation_id,
          first_name,
          last_name,
          mobile_number,
          people,
          reservation_date,
          reservation_time,
          status
        }) => (
          <article key={reservation_id} style={{border: 'solid'}}>
            <p>{first_name}</p>
            <p>{last_name}</p>
            <p>{mobile_number}</p>
            <p>{reservation_date}</p>
            <p>{reservation_time}</p>
            <p>{people}</p>
            <p data-reservation-id-status={reservation_id}>{status}</p>
            { status === "booked" && <a href={`/reservations/${reservation_id}/seat`}> <button>Seat</button></a>}
          </article>
        )
      )}
    </section>
  );
};

export default ReservationsList;
