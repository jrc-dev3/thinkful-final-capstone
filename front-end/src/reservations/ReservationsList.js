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
    <section className="container">
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
          <section key={reservation_id} className="card p-3 my-3 shadow">
            <article className="card-body">
              <p className="card-text"><b>First Name:</b> {first_name}</p>
              <p className="card-text"><b>Last Name:</b> {last_name}</p>
              <p className="card-text"><b>Mobile:</b> {mobile_number}</p>
              <p className="card-text"><b>Date:</b> {reservation_date}</p>
              <p className="card-text"><b>Time:</b> {reservation_time}</p>
              <p className="card-text"><b>People:</b> {people}</p>
              <p
                className="card-text"
                data-reservation-id-status={reservation_id}
              >
                <b>Status:</b> {status}
              </p>
              {status === "booked" && (
                <div className="w-100 d-inline-flex justify-content-end" >
                  <button
                    className="btn btn-danger ml-2"
                    onClick={handleCancellation}
                    data-reservation-id-cancel={reservation_id}
                  >
                    Cancel
                  </button>
                  <Link
                    href={`/reservations/${reservation_id}/edit`}
                    to={`/reservations/${reservation_id}/edit`}
                  >
                    <button className="btn btn-warning ml-2">Edit</button>
                  </Link>
                  <Link
                    href={`/reservations/${reservation_id}/seat`}
                    to={`/reservations/${reservation_id}/seat`}
                  >
                    <button className="btn btn-success ml-2">Seat</button>
                  </Link>
                </div>
              )}
            </article>
          </section>
        )
      )}
    </section>
  );
};

export default ReservationsList;
