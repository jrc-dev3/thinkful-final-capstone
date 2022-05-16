import React from "react";

const ReservationsList = ({ reservations }) => {
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
        }) => (
          <article key={reservation_id} style={{border: 'solid'}}>
            <p>{first_name}</p>
            <p>{last_name}</p>
            <p>{mobile_number}</p>
            <p>{reservation_date}</p>
            <p>{reservation_time}</p>
            <p>{people}</p>
            <a href={`/reservations/${reservation_id}/seat`}> <button>Seat</button></a>
          </article>
        )
      )}
    </section>
  );
};

export default ReservationsList;
