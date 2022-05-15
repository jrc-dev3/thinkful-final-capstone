const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
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

const validateBody = (req,res,next) => {
  const body = req.body;

  if (body) {
       
    let today = new Date();
    const offset = today.getTimezoneOffset();
    today = new Date(today.getTime() - offset * 60 * 1000);

    const { reservation_date, reservation_time } = body;
    const reservedDate = new Date(`${reservation_date}T${reservation_time}Z`);

    if (reservedDate.getDay() === 2)
      next({ status: 400, message: "Closed on Tuesdays!" });
    if (reservedDate.getTime() < today.getTime())
      next({ status: 400, message: "Past date!" });

    res.locals.body = body 
    return next();
  }

  next({
    status: 400,
    message: "Missing body.",
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

module.exports = {
  list: [validateQuery, asyncErrorBoundary(list)],
  create: [validateBody, asyncErrorBoundary(create)],
};
