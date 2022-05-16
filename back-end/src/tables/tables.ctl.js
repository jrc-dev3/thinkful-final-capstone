const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const tablesSvc = require("./tables.svc");
const resSvc = require("../reservations/reservations.svc");
const hasProperties = require("../errors/hasProperties");
const { validateReservationExists } = require("../reservations/reservations.ctl");

const validateTableId = (req, res, next) => {
  const { table_id } = req.params;

  if (table_id) {
    res.locals.table_id = table_id;
    return next();
  }

  next({
    status: 400,
    message: "Missing table_id.",
  });
};

const validateUpdateBody = (req, res, next) => {
  const body = req.body.data;
  
  if (body) {
    const { reservation_id } = body;
    hasProperties(["reservation_id"], body, next, () => {

      if (!reservation_id && !reservation_id === null)
        return next({ status: 400, message: "reservation_id" });
    })

    res.locals.reservation_id = reservation_id;
    return next();
  }

  return next({
    status: 400,
    messsage: "Missing data",
  });
};

const validateTableExists = async (req, res, next) => {
  const table_id = res.locals.table_id;

  const table = await tablesSvc.read(table_id);

  if (table) {
    if (table.reservation_id)
      return next({ status: 400, message: "occupied." });

    res.locals.table = table;
    return next();
  }

  next({
    status: 400,
    messsage: "Table not found!",
  });
};

const validateTable = async (req, res, next) => {
  const reservation_id = res.locals.reservation_id;
  const { capacity } = res.locals.table;
  const { people } = await resSvc.read(reservation_id);

  if (people > capacity) return next({ status: 400, message: "capacity" });

  return next();
};

const validateBody = (req, res, next) => {
  const body = req.body.data;

  if (body) {
    const { table_name, capacity } = body;

    hasProperties(["table_name", "capacity"], body, next, () => {
      if (table_name.length < 2)
        return next({ status: 400, message: "table_name" });
      if (typeof capacity !== "number")
        return next({ status: 400, message: "capacity" });
      if (capacity < 1) return next({ status: 400, message: "capacity" });
    });

    res.locals.body = body;
    return next();
  }

  next({
    status: 400,
    message: "Missing data.",
  });
};

/**
 * List handler for tables resources
 */
async function list(req, res) {
  console.log("GET", req.url);

  const data = await tablesSvc.list();

  res.json({
    data,
  });
}

const create = async (req, res) => {
  console.log("POST", req.url, req.body);

  const body = res.locals.body;
  const data = await tablesSvc.create(body);

  res.status(201).json({
    data,
  });
};

const update = async (req, res) => {
  const table_id = res.locals.table_id;
  const reservation_id = res.locals.reservation_id;
  const updateBody = { reservation_id };

  await tablesSvc.update(table_id, updateBody);

  res.json({});
};

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [validateBody, asyncErrorBoundary(create)],
  update: [
    validateTableId,
    validateUpdateBody,
    asyncErrorBoundary(validateReservationExists),
    asyncErrorBoundary(validateTableExists),
    asyncErrorBoundary(validateTable),
    asyncErrorBoundary(update),
  ],
};
