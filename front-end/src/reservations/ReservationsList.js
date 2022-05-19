import React from "react";
import { updateReservationStatus } from "../utils/api";
import { Link } from "react-router-dom";

const ReservationsList = ({ reservations, refresh }) => {
  const handleCancellation = (e) => {
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      const reservation_id = e.target.getAttribute(
        "data-reservation-id-cancel"
      );
      const status = "cancelled";
      const body = { reservation_id, status };
      updateReservationStatus(body).then(() => refresh());
    }
  };

  if (typeof reservations === "string") return <h2>{reservations}</h2>;

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
          status,
        }) => (
          <article key={reservation_id} style={{ border: "solid" }}>
            <p>{first_name}</p>
            <p>{last_name}</p>
            <p>{mobile_number}</p>
            <p>{reservation_date}</p>
            <p>{reservation_time}</p>
            <p>{people}</p>
            <p data-reservation-id-status={reservation_id}>{status}</p>
            {status === "booked" && (
              <>
                <Link
                  href={`/reservations/${reservation_id}/seat`}
                  to={`/reservations/${reservation_id}/seat`}
                >
                  <button>Seat</button>
                </Link>
                <Link
                  href={`/reservations/${reservation_id}/edit`}
                  to={`/reservations/${reservation_id}/edit`}
                >
                  <button>Edit</button>
                </Link>
                <button
                  onClick={handleCancellation}
                  data-reservation-id-cancel={reservation_id}
                >
                  Cancel
                </button>
              </>
            )}
          </article>
        )
      )}
    </section>
  );
};

export default ReservationsList;
