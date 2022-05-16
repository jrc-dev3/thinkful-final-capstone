const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const resSvc = require("./reservations.svc");

const validateQuery = (req, res, next) => {
  const { date } = req.query;

  if (date) {
    res.locals.date = date;
    return next();
  }

  next({
    status: 400,
    message: "Missing date URL Parameter.",
  });
};

const validateId = (req, res, next) => {
  const { reservation_id } = req.params;
  if (reservation_id) {
    res.locals.reservation_id = reservation_id;
    return next();
  }

  next({
    status: 404,
    message: "reservation_id",
  });
};

const validateReservationExists = async (req, res, next) => {
  const reservation_id = res.locals.reservation_id;
  const reservation = await resSvc.read(reservation_id);

  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }

  next({
    status: 404,
    message: `${reservation_id}`,
  });
};

const validateBody = (req, res, next) => {
  const body = req.body.data;

  if (body) {
    const requiredKeys = [
      "first_name",
      "last_name",
      "mobile_number",
      "reservation_date",
      "reservation_time",
      "people",
    ];

    hasProperties(requiredKeys, body, next, () => {

      const { reservation_date, reservation_time, people } = body;
      if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(reservation_date))
        return next({ status: 400, message: "reservation_date" });

      if (!/^[0-9]{2}\:[0-9]{2}$/.test(reservation_time))
        return next({ status: 400, message: "reservation_time" });

      if (typeof people !== "number")
        return next({ status: 400, message: "people" });
      if (people === 0) return next({ status: 400, message: "people" });

      //create today date to compare    
      let today = new Date();
      const offset = today.getTimezoneOffset();
      today = new Date(today.getTime() - offset * 60 * 1000);
      const reservedDate = new Date(`${reservation_date}T${reservation_time}Z`);
  
      if (reservedDate.getDay() === 2)
        return next({ status: 400, message: "closed" });
      if (reservedDate.getTime() < today.getTime())
        return next({ status: 400, message: "future" });
  
      if (reservation_time < "10:30")
        return next({ status: 400, message: "closed" });
  
      if (reservation_time > "21:30")
        return next({ status: 400, message: "closed" });
    });
  
    //at this point, we confirmed the body is valid and has values present
    res.locals.body = body;
    return next();
  }

  return next({
    status: 400,
    message: "Missing data.",
  });
};

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  console.log("GET", req.url, req.query);

  const date = res.locals.date;
  const data = await resSvc.list(date);

  res.json({
    data,
  });
}

const create = async (req, res) => {
  console.log("POST", req.url, req.body);

  const body = res.locals.body;
  const data = await resSvc.create(body);

  res.status(201).json({
    data,
  });
};

const read = async (req, res) => {
  const reservation = res.locals.reservation;
  res.json({ data: reservation });
};

module.exports = {
  list: [validateQuery, asyncErrorBoundary(list)],
  create: [validateBody, asyncErrorBoundary(create)],
  read: [
    validateId,
    asyncErrorBoundary(validateReservationExists),
    asyncErrorBoundary(read),
  ],
  validateReservationExists
};
