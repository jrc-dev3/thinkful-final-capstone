const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const resSvc = require("./reservations.svc");

const validateQuery = (req, res, next) => {
  const { date, mobile_number } = req.query;

  if (date) {
    res.locals.date = date;
    return next();
  }

  if(mobile_number){
    res.locals.mobile_number = mobile_number
    return next();
  }
 
  next({
    status: 400,
    message: "Missing Parameter",
  });
};

const validateReservationId = (req, res, next) => {
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

const validateReservationStatus = async (req, res, next) => {
  const { status } = res.locals.reservation;

  if (status === "finished") return next({ status: 400, message: "finished" });

  next();
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
      const { reservation_date, reservation_time, people, status } = body;
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

      if (/(seated|finished)/.test(status))
        return next({ status: 400, message: `${status}` });
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

const validateUpdateBody = (req, res, next) => {
  const body = req.body.data;

  if (body) {
    hasProperties(["status"], body, next, () => {
      const { status } = body;
      if (!/^(booked|seated|finished|cancelled)/.test(status))
        return next({ status: 400, message: `${status}` });
    });

    res.locals.body = body;
    return next();
  }

  next({ status: 400, message: "Missing data." });
};

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  console.log("GET", req.url, req.query);

  const date = res.locals.date
  const mobile_number = res.locals.mobile_number

  if(date){
    let data = await resSvc.list(date);
    data = data.filter(({ status }) => status !== "finished");
  
    res.json({
      data,
    });
  }

  if(mobile_number){
    const data = await resSvc.search(mobile_number)
    res.json({data})
  }

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

const update = async (req, res) => {
  console.log("PUT", req.url, req.body);

  const reservation_id = res.locals.reservation_id;
  const updateBody = res.locals.body;

  const data = await resSvc.update(reservation_id, updateBody);

  res.json({ data });
};

module.exports = {
  validateReservationExists,
  list: [validateQuery, asyncErrorBoundary(list)],
  create: [validateBody, asyncErrorBoundary(create)],
  read: [
    validateReservationId,
    asyncErrorBoundary(validateReservationExists),
    asyncErrorBoundary(read),
  ],
  update: [
    validateReservationId,
    (req,res,next) => {
      if(req.url.includes("status")){
        return validateUpdateBody(req,res,next)
      }else{
        return validateBody(req,res,next)
      }
    },
    asyncErrorBoundary(validateReservationExists),
    validateReservationStatus,
    asyncErrorBoundary(update),
  ],
};
