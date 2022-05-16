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

const validateBody = (req, res, next) => {
  const body = req.body.data;

  if (body) {
    //check body has all required keys with non-empty values
    const requiredKeys = [
      "first_name",
      "last_name",
      "mobile_number",
      "reservation_date",
      "reservation_time",
      "people",
    ];

    const bodyKeys = Object.keys(body);
    for (const requiredKey of requiredKeys) {
      if (bodyKeys.includes(requiredKey)) {
        if (!body[requiredKey])
          return next({ status: 400, message: `${requiredKey}` });

        const value = body[requiredKey];
        switch (requiredKey) {
          case "reservation_date":
            if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(value))
              return next({ status: 400, message: `${requiredKey}` });
            break;
          case "reservation_time":
            if (!/^[0-9]{2}\:[0-9]{2}$/.test(body.reservation_time))
              return next({ status: 400, message: `${requiredKey}` });
            break;
          case "people":
            if (typeof value !== "number")
              return next({ status: 400, message: `${requiredKey}` });
            if (value === 0)
              return next({ status: 400, message: `${requiredKey}` });
            break;

          default:
        }
      } else {
        return next({
          status: 400,
          message: `${requiredKey}`,
        });
      }
    }

    //at this point, we confirmed the body is valid and has values present

    //check for valid reservation_date/time
    const dateTimeString = `${body.reservation_date}T${body.reservation_time}Z`;
    const testDate = new Date(dateTimeString);

    //create today date to compare
    let today = new Date();
    const offset = today.getTimezoneOffset();
    today = new Date(today.getTime() - offset * 60 * 1000);

    const { reservation_date, reservation_time } = body;
    const reservedDate = new Date(`${reservation_date}T${reservation_time}Z`);

    //if its Tuesday
    if (reservedDate.getDay() === 2)
      return next({ status: 400, message: "closed" });
    //if reservation is before today
    if (reservedDate.getTime() < today.getTime())
      return next({ status: 400, message: "future" });
    //

    if (reservation_time < "10:30")
      return next({ status: 400, message: "closed" });

    if (reservation_time > "21:30")
      return next({ status: 400, message: "closed" });

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
  console.log(data);

  res.status(201).json({
    data,
  });
};

module.exports = {
  list: [validateQuery, asyncErrorBoundary(list)],
  create: [validateBody, asyncErrorBoundary(create)],
};
