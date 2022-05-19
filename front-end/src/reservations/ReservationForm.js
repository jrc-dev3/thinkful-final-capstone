import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import {
  addReservation,
  readReservation,
  updateReservation,
} from "../utils/api";

const ReservationForm = () => {
  const initialForm = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  };

  const [formData, setFormData] = useState({ ...initialForm });
  const [reservationsError, setReservationsError] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const { reservation_id } = useParams();
  const history = useHistory();

  useEffect(() => {
    const checkIfEdit = () => {

      const abortController = new AbortController();
      if (reservation_id) {
        readReservation(reservation_id,abortController.signal)
          .then(setFormData)
          .then(() => setIsEdit(true));

          return () => abortController.abort();
      }
    };

    checkIfEdit();
  }, [reservation_id]);

  const isValidForm = (form) => {
    const { reservation_date, reservation_time } = form;

    let today = new Date();
    const offset = today.getTimezoneOffset();
    today = new Date(today.getTime() - offset * 60 * 1000);
    const reservedDate = new Date(`${reservation_date}T${reservation_time}Z`);

    setReservationsError(null);

    if (reservedDate.getDay() === 2) {
      setReservationsError(Error("We are closed on Tuesdays!"));
      return false;
    }

    if (reservedDate.getTime() < today.getTime()) {
      setReservationsError(Error("We cannot serve you yesterday!"));
      return false;
    }

    if (reservation_time < "10:30") {
      setReservationsError("Too early!");
      return false;
    }

    if (reservation_time > "21:30") {
      setReservationsError("Too early!");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      first_name,
      last_name,
      mobile_number,
      reservation_date,
      reservation_time,
      people,
    } = formData;

    let postBody = {
      first_name,
      last_name,
      mobile_number,
      reservation_date,
      reservation_time,
      people: Number(people),
    };

    if (isValidForm(postBody)) {
      const abortController = new AbortController();

      if (isEdit) {
        const updateBody = {
          ...postBody,
          reservation_id,
        };

        updateReservation(updateBody, abortController.signal)
          //.then(() => history.goBack())
          .then(() => history.push(`/dashboard?date=${reservation_date}`))
          .catch(setReservationsError);

        //history.goBack()
      } else {
        addReservation(postBody, abortController.signal)
          .then(() => history.push(`/dashboard?date=${reservation_date}`))
          .catch(setReservationsError);
      }

      return false;
    }
  };

  const handleOnChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  } = formData;

  return (
    <section>
      <ErrorAlert error={reservationsError} />
      <input
        required
        placeholder="John"
        value={first_name}
        name="first_name"
        type="text"
        onChange={handleOnChange}
      />
      <input
        required
        placeholder="Doe"
        value={last_name}
        name="last_name"
        type="text"
        onChange={handleOnChange}
      />
      <input
        required
        placeholder="555-555-1234 "
        value={mobile_number}
        name="mobile_number"
        type="text"
        pattern="^[0-9]{3}-[0-9]{3}-[0-9]{4}$"
        onChange={handleOnChange}
      />
      <input
        required
        placeholder="YYYY-MM-DD"
        pattern="\d{4}-\d{2}-\d{2}"
        value={reservation_date}
        name="reservation_date"
        // onInvalid={(e) => {
        //   e.preventDefault()
        //   console.log(e)
        //   alert(e)
        // }}
        // min={dateString}
        type="date"
        onChange={handleOnChange}
      />
      <input
        required
        placeholder="HH:MM"
        pattern="[0-9]{2}:[0-9]{2}"
        value={reservation_time}
        name="reservation_time"
        type="time"
        min="09:00"
        max="21:00"
        onChange={handleOnChange}
      />
      <input
        required
        placeholder={1}
        value={people}
        name="people"
        type="number"
        min="1"
        onChange={handleOnChange}
      />

      <button type="submit" onClick={handleSubmit}>
        Submit
      </button>
      <button onClick={history.goBack}>Cancel</button>
    </section>
  );
};

export default ReservationForm;
